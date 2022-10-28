import { IsNotEmpty, IsString } from 'class-validator';

export class TeacherDto {
	@IsNotEmpty()
	@IsString()
	fullname: string;
}
