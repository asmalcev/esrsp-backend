import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class TeacherDto {
	@IsOptional()
	@IsInt()
	id: number;

	@IsNotEmpty()
	@IsString()
	fullname: string;
}
