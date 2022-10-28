import { IsNotEmpty, IsString } from 'class-validator';

export class DisciplineDto {
	@IsNotEmpty()
	@IsString()
	name: string;
}
