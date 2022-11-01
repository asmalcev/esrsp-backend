import { BadRequestException, Injectable } from '@nestjs/common';
import { parse } from 'src/parsers/voenmeh-xml-parser/parser';
import { RolesService } from 'src/roles/roles.service';
import { ScheduleService } from 'src/schedule/schedule.service';

@Injectable()
export class UploadService {
	constructor(
		private readonly scheduleService: ScheduleService,
		private readonly rolesService: RolesService,
	) {}

	async fillWithVoenmehTimetable(timetableXml: string): Promise<void> {
		try {
			const result = parse(timetableXml);

			await this.rolesService.createTeachers(result.teachers);
			await this.scheduleService.createDisciplines(result.disciplines);
			await this.scheduleService.createStudentGroups(result.groups);
			await this.scheduleService.createLessonsByNames(result.lessons);
		} catch (error) {
			throw new BadRequestException([
				'file format must be xml',
				'the contents of the file must be formatted according to the rules of the Voenmeh schedule',
			]);
		}
	}

	async removeAll(): Promise<void> {
		this.scheduleService.removeAllDisciplines();
		this.scheduleService.removeAllLessons();
		this.scheduleService.removeAllStudentGroups();
		this.rolesService.removeAllStudents();
		this.rolesService.removeAllTeachers();
	}
}
