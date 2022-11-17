import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class LessonTimeDto {
	@IsNotEmpty()
	@IsNumber()
	id: number;

	@IsNotEmpty()
	@IsString()
	timeStart: string;

	@IsNotEmpty()
	@IsString()
	timeEnd: string;
}
