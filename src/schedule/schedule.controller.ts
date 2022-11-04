import {
	Body,
	Controller,
	Delete,
	Get,
	NotFoundException,
	Param,
	ParseIntPipe,
	Post,
	Put,
	Session,
	UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { successResponse } from 'src/common-responses';
import { WithMsg } from 'src/common-types';
import { UserRole } from 'src/users/dto/user.dto';
import { DisciplineDto } from './dto/discipline.dto';
import { LessonDto } from './dto/lesson.dto';
import { StudentGroupDto } from './dto/student-group.dto';
import { Discipline } from './entity/discipline';
import { Lesson } from './entity/lesson';
import { StudentGroup } from './entity/student-group';
import { ScheduleService } from './schedule.service';

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

	@Get('/group')
	async getStudentGroups(): Promise<StudentGroup[]> {
		return this.scheduleService.getStudentGroups();
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
	): Promise<WithMsg> {
		this.scheduleService.updateStudentGroup(id, studentGroupDto);
		return successResponse;
	}

	@Delete('/group/:id')
	async removeStudentGroup(
		@Param('id', ParseIntPipe) id: number,
	): Promise<WithMsg> {
		this.scheduleService.removeStudentGroup(id);
		return successResponse;
	}

	/*
	 * Discipline
	 */
	@Get('/discipline/:id')
	async getDiscipline(
		@Param('id', ParseIntPipe) id: number,
	): Promise<Discipline> {
		return this.scheduleService.getDiscipline(id);
	}

	@Get('/discipline')
	async getDisciplines(): Promise<Discipline[]> {
		return this.scheduleService.getDisciplines();
	}

	@Post('/discipline')
	async createDiscipline(
		@Body() disciplineDto: DisciplineDto,
	): Promise<Discipline> {
		return this.scheduleService.createDiscipline(disciplineDto);
	}

	@Put('/discipline/:id')
	async updateDiscipline(
		@Param('id', ParseIntPipe) id: number,
		@Body() disciplineDto: Partial<DisciplineDto>,
	): Promise<WithMsg> {
		this.scheduleService.updateDiscipline(id, disciplineDto);
		return successResponse;
	}

	@Delete('/discipline/:id')
	async removeDiscipline(
		@Param('id', ParseIntPipe) id: number,
	): Promise<WithMsg> {
		this.scheduleService.removeDiscipline(id);
		return successResponse;
	}

	/*
	 * Lesson
	 */
	@Get('/lesson/:id')
	async getLesson(@Param('id', ParseIntPipe) id: number): Promise<Lesson> {
		return this.scheduleService.getLesson(id);
	}

	@Get('/lesson')
	async getLessons(): Promise<Lesson[]> {
		return this.scheduleService.getLessons();
	}

	@Post('/lesson')
	async createLesson(@Body() lessonDto: LessonDto): Promise<Lesson> {
		return this.scheduleService.createLesson(lessonDto);
	}

	@Put('/lesson/:id')
	async updateLesson(
		@Param('id', ParseIntPipe) id: number,
		@Body() lessonDto: Partial<LessonDto>,
	): Promise<WithMsg> {
		this.scheduleService.updateLesson(id, lessonDto);
		return successResponse;
	}

	@Delete('/lesson/:id')
	async removeLesson(@Param('id', ParseIntPipe) id: number): Promise<WithMsg> {
		this.scheduleService.removeLesson(id);
		return successResponse;
	}

	/*
	 * Schedule
	 */
	@Get('/teacher/:id')
	async getTeacherSchedule(
		@Param('id', ParseIntPipe) id: number,
	): Promise<Lesson[]> {
		return await this.scheduleService.getTeacherSchedule(id);
	}

	@Get('/student/:id')
	async getStudentSchedule(
		@Param('id', ParseIntPipe) id: number,
	): Promise<Lesson[]> {
		return await this.scheduleService.getStudentSchedule(id);
	}

	@Get('/')
	@UseGuards(AuthGuard)
	async getUserSchedule(
		@Session() session: Record<string, any>,
	): Promise<Lesson[]> {
		if (session.user.role === UserRole.STUDENT) {
			return await this.scheduleService.getStudentSchedule(session.user.roleId);
		}
		if (session.user.role === UserRole.TEACHER) {
			return await this.scheduleService.getTeacherSchedule(session.user.roleId);
		}
		throw new NotFoundException('no schedule for your account type');
	}

	@Get('/teacher/:id/groups')
	async getTeacherStudentGroups(
		@Param('id', ParseIntPipe) id: number,
		// ): Promise<StudentGroup[]> {
	): Promise<any> {
		return await this.scheduleService.getTeacherStudentGroups(id);
	}
}
