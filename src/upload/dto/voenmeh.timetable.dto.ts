import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class VoenmehTimetableDto {
	@IsOptional()
	@IsBoolean()
	clearTables: boolean;

	@IsNotEmpty()
	@IsString()
	data: string;
}
