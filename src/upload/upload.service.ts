import { Injectable } from '@nestjs/common';
import { RolesService } from 'src/roles/roles.service';
import { ScheduleService } from 'src/schedule/schedule.service';

@Injectable()
export class UploadService {
	constructor(
		private readonly scheduleService: ScheduleService,
		private readonly rolesService: RolesService,
	) {}

	fillWithVoenmehTimetable(timetableXml: string): void {
		console.log(timetableXml.length);
	}

	removeAll(): void {
		this.scheduleService.removeAllDisciplines();
		this.scheduleService.removeAllLessons();
		this.scheduleService.removeAllStudentGroups();
		this.rolesService.removeAllStudents();
		this.rolesService.removeAllTeachers();
	}
}
