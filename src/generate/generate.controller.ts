import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/roles/roles.guard';
import { GenerateService } from './generate.service';
import { TeacherStudentUsers } from './generate.types';

@UseGuards(AuthGuard)
@Roles('admin')
@Controller('generate')
export class GenerateController {
	constructor(private readonly generateService: GenerateService) {}

	@Get('/users')
	async generateUsers(): Promise<TeacherStudentUsers> {
		return this.generateService.generateUsers();
	}
}
