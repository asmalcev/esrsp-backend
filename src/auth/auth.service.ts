import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserRole } from 'src/users/dto/user.dto';
import { UsersService } from 'src/users/users.service';
import { AuthUserDto } from './dto/auth.dto';

export type ValidatedUser = {
	id: number;
	username: string;
	role: UserRole;
	roleId: number;
};

@Injectable()
export class AuthService {
	constructor(private readonly usersService: UsersService) {}

	async validateUser(authUserDto: AuthUserDto): Promise<ValidatedUser> {
		const user = await this.usersService.getUserByUsername(
			authUserDto.username,
		);

		const NotFoundMsg = `Couldn't find user with given username and password`;
		if (!user) {
			throw new NotFoundException(NotFoundMsg);
		}

		const validPassword = await bcrypt.compare(
			authUserDto.password,
			user.password,
		);

		if (!validPassword) {
			throw new NotFoundException(NotFoundMsg);
		}

		const { password, ...other } = user;
		return other;
	}
}
