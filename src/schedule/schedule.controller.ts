import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseIntPipe,
	Post,
	Put,
} from '@nestjs/common';
import { WithMsg } from 'src/common-types';
import { DisciplineDto } from './dto/discipline.dto';
import { LessonDto } from './dto/lesson.dto';
import { StudentGroupDto } from './dto/student-group.dto';
import { Discipline } from './entity/discipline';
import { Lesson } from './entity/lesson';
import { StudentGroup } from './entity/student-group';
import { ScheduleService } from './schedule.service';

type StudentGroupUpdateResponse = WithMsg & {};
type StudentGroupRemoveResponse = WithMsg & {};

type DisciplineUpdateResponse = WithMsg & {};
type DisciplineRemoveResponse = WithMsg & {};

type LessonUpdateResponse = WithMsg & {};
type LessonRemoveResponse = WithMsg & {};

@Controller('schedule')
export class ScheduleController {
	constructor(private readonly scheduleService: ScheduleService) {}

	/*
	 * Student Group
	 */
	@Get('/group/:id')
	async getStudentGroup(
		@Param('id', ParseIntPipe) id: number,
	): Promise<StudentGroup> {
		return this.scheduleService.getStudentGroup(id);
	}

	@Post('/group')
	async createStudentGroup(
		@Body() studentGroupDto: StudentGroupDto,
	): Promise<StudentGroup> {
		return this.scheduleService.createStudentGroup(studentGroupDto);
	}

	@Put('/group/:id')
	async updateStudentGroup(
		@Param('id', ParseIntPipe) id: number,
		@Body() studentGroupDto: Partial<StudentGroupDto>,
	): Promise<StudentGroupUpdateResponse> {
		this.scheduleService.updateStudentGroup(id, studentGroupDto);
		return {
			msg: 'success',
		};
	}

	@Delete('/group/:id')
	async removeStudentGroup(
		@Param('id', ParseIntPipe) id: number,
	): Promise<StudentGroupRemoveResponse> {
		this.scheduleService.removeStudentGroup(id);
		return {
			msg: 'success',
		};
	}

	/*
	 * Discipline
	 */
	@Get('/group/:id')
	async getDiscipline(
		@Param('id', ParseIntPipe) id: number,
	): Promise<Discipline> {
		return this.scheduleService.getDiscipline(id);
	}

	@Post('/group')
	async createDiscipline(
		@Body() disciplineDto: DisciplineDto,
	): Promise<Discipline> {
		return this.scheduleService.createDiscipline(disciplineDto);
	}

	@Put('/group/:id')
	async updateDiscipline(
		@Param('id', ParseIntPipe) id: number,
		@Body() disciplineDto: Partial<DisciplineDto>,
	): Promise<DisciplineUpdateResponse> {
		this.scheduleService.updateDiscipline(id, disciplineDto);
		return {
			msg: 'success',
		};
	}

	@Delete('/group/:id')
	async removeDiscipline(
		@Param('id', ParseIntPipe) id: number,
	): Promise<DisciplineRemoveResponse> {
		this.scheduleService.removeDiscipline(id);
		return {
			msg: 'success',
		};
	}

	/*
	 * Lesson
	 */
	@Get('/group/:id')
	async getLesson(@Param('id', ParseIntPipe) id: number): Promise<Lesson> {
		return this.scheduleService.getLesson(id);
	}

	@Post('/group')
	async createLesson(@Body() lessonDto: LessonDto): Promise<Lesson> {
		return this.scheduleService.createLesson(lessonDto);
	}

	@Put('/group/:id')
	async updateLesson(
		@Param('id', ParseIntPipe) id: number,
		@Body() lessonDto: Partial<LessonDto>,
	): Promise<LessonUpdateResponse> {
		this.scheduleService.updateLesson(id, lessonDto);
		return {
			msg: 'success',
		};
	}

	@Delete('/group/:id')
	async removeLesson(
		@Param('id', ParseIntPipe) id: number,
	): Promise<LessonRemoveResponse> {
		this.scheduleService.removeLesson(id);
		return {
			msg: 'success',
		};
	}
}
