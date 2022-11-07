import { Controller, Get } from '@nestjs/common';
import { GenerateService } from './generate.service';
import { TeacherStudentUsers } from './generate.types';

@Controller('generate')
export class GenerateController {
	constructor(private readonly generateService: GenerateService) {}

	@Get('/users')
	async generateUsers(): Promise<TeacherStudentUsers> {
		return this.generateService.generateUsers();
	}
}
