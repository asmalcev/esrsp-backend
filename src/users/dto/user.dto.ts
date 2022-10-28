import { IsEnum, IsInt, Min, IsOptional } from 'class-validator';

import { AuthUserDto } from 'src/auth/dto/auth.dto';

export enum UserRole {
	NOTaUSER = 0,
	STUDENT = 1,
	TEACHER = 2,
	ADMIN = 3,
}

export class UserDto extends AuthUserDto {
	@IsOptional()
	@IsEnum(UserRole)
	role: UserRole;

	@IsOptional()
	@IsInt()
	@Min(0)
	roleId: number;
}

export type PartialUserDto = Partial<UserDto>;
