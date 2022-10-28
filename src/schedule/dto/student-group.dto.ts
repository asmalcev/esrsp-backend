import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class StudentGroupDto {
	@IsNotEmpty()
	@IsString()
	@MaxLength(16)
	name: string;
}
