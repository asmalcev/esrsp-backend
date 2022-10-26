import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class AuthUserDto {
	@IsNotEmpty()
	@IsString()
	@MinLength(4)
	username: string;

	@IsNotEmpty()
	@IsString()
	@MinLength(4)
	password: string;
}
