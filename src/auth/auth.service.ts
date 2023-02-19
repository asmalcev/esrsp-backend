import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Student } from 'src/roles/entity/student';
import { Teacher } from 'src/roles/entity/teacher';
import { RolesService } from 'src/roles/roles.service';
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
	constructor(
		private readonly usersService: UsersService,
		private readonly rolesService: RolesService,
	) {}

	async validateUser(authUserDto: AuthUserDto): Promise<ValidatedUser> {
		const user = await this.usersService.getUserByUsername(
			authUserDto.username,
			false,
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

		let role: Teacher | Student = null;
		if (other.role === UserRole.STUDENT) {
			role = await this.rolesService.getStudent(other.roleId);
		} else if (other.role === UserRole.TEACHER) {
			role = await this.rolesService.getTeacher(other.roleId);
		}

		if (role) {
			return {
				...role,
				...other,
			};
		}

		return other;
	}
}
