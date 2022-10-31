import {
	IsArray,
	IsInt,
	IsNotEmpty,
	IsString,
	Max,
	Min,
} from 'class-validator';

export class LessonDto {
	@IsNotEmpty()
	@IsArray()
	studentGroupIds: number[];

	@IsInt()
	teacherId: number;

	@IsNotEmpty()
	@IsInt()
	disciplineId: number;

	@IsNotEmpty()
	@IsInt()
	@Min(1)
	@Max(8)
	lessonNumber: number;

	@IsNotEmpty()
	@IsInt()
	@Min(1)
	@Max(14)
	lessonDay: number;

	@IsNotEmpty()
	@IsString()
	place: string;
}
