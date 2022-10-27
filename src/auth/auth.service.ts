import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { AuthUserDto } from './dto/auth.dto';

export type ValidatedUser = {
	userId: number;
	username: string;
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

		return {
			userId: user.id,
			username: user.username,
		};
	}
}
