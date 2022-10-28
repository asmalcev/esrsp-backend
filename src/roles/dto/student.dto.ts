import { IsInt, IsNotEmpty, IsString, MaxLength, Min } from 'class-validator';

export class StudentDto {
	@IsNotEmpty()
	@IsString()
	fullname: string;

	@IsNotEmpty()
	@IsString()
	@MaxLength(16)
	recordBook: string;

	@IsInt()
	@Min(0)
	studentGroupId: number;
}
