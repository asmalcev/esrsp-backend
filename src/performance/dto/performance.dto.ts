import { IsDateString, IsInt, IsNotEmpty, Min } from 'class-validator';

export class PerformanceDto {
	@IsNotEmpty()
	value: string;

	@IsNotEmpty()
	@IsDateString()
	date: Date;

	@IsNotEmpty()
	@IsInt()
	@Min(0)
	studentId: number;

	@IsNotEmpty()
	@IsInt()
	@Min(0)
	disciplineId: number;
}
