import { IsNotEmpty, IsEnum, IsInt, Min } from 'class-validator';

import { AuthUserDto } from 'src/auth/dto/auth.dto';

export enum UserRole {
	STUDENT = 0,
	TEACHER = 1,
	ADMIN = 2
}

export class UserDto extends AuthUserDto {
	@IsNotEmpty()
	@IsEnum(UserRole)
	role: UserRole;

	@IsInt()
	@Min(0)
	roleid: number;
}
