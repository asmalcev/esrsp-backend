import { BadRequestException, Injectable } from '@nestjs/common';
import { parse } from 'src/parsers/voenmeh-xml-parser/parser';
import { RolesService } from 'src/roles/roles.service';
import { LessonTimeDto } from 'src/schedule/dto/lesson-time.dto';
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
		await this.scheduleService.removeAllDisciplines();
		await this.scheduleService.removeAllLessons();
		await this.scheduleService.removeAllStudentGroups();
		await this.rolesService.removeAllStudents();
		await this.rolesService.removeAllTeachers();
	}

	async removeAllLessonsTimes(): Promise<void> {
		await this.scheduleService.removeAllLessonsTimes();
	}

	async fillWithTimetable(timetableJson: string): Promise<void> {
		try {
			const result = JSON.parse(timetableJson);

			await this.rolesService.createTeachers(result.teachers);
			await this.scheduleService.createDisciplines(result.disciplines);
			await this.scheduleService.createStudentGroups(result.groups);
			await this.scheduleService.createLessonsByNames(result.lessons);
		} catch (error) {
			if (error instanceof SyntaxError) {
				throw new BadRequestException([
					'file format must be json',
					'the contents of the file must be formatted according to the standard schema',
				]);
			} else {
				throw new BadRequestException([
					'data should not contain duplicates with existing ones',
					'all relationships between data must be valid',
					'data must be of the correct types',
				]);
			}
		}
	}

	async fillWithStudentGroups(groups: string): Promise<void> {
		try {
			const result = JSON.parse(groups);

			for (const group of result) {
				const _group = await this.scheduleService.getStudentGroupByName(
					group.name,
					{},
				);
				await this.rolesService.createStudents(
					group.students.map((student) => ({
						...student,
						studentGroupId: _group.id,
					})),
				);
			}
		} catch (error) {
			if (error instanceof SyntaxError) {
				throw new BadRequestException([
					'file format must be json',
					'the contents of the file must be formatted according to the standard schema',
				]);
			} else {
				throw new BadRequestException([
					'data should not contain duplicates with existing ones',
					'all relationships between data must be valid',
					'data must be of the correct types',
				]);
			}
		}
	}

	async fillWithLessonsTimes(lessonsTimes: string): Promise<void> {
		try {
			const result: LessonTimeDto[] = JSON.parse(lessonsTimes);

			for (const lessonTime of result) {
				if (!lessonTime.id || !lessonTime.timeStart || !lessonTime.timeEnd) {
					throw new Error();
				}
			}

			await this.scheduleService.createLessonsTimes(result);
		} catch (error) {
			if (error instanceof SyntaxError) {
				throw new BadRequestException([
					'file format must be json',
					'the contents of the file must be formatted according to the standard schema',
				]);
			} else {
				throw new BadRequestException([
					'data should not contain duplicates with existing ones',
					'data must be of the correct types',
				]);
			}
		}
	}
}
