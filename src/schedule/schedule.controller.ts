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
import { Teacher } from 'src/roles/entity/teacher';
import { Roles } from 'src/roles/roles.guard';
import { UserRole } from 'src/users/dto/user.dto';
import { DisciplineDto } from './dto/discipline.dto';
import { LessonTimeDto } from './dto/lesson-time.dto';
import { LessonDto } from './dto/lesson.dto';
import { StudentGroupDto } from './dto/student-group.dto';
import { Discipline } from './entity/discipline';
import { Lesson } from './entity/lesson';
import { LessonTime } from './entity/lesson-time';
import { StudentGroup } from './entity/student-group';
import { ScheduleService } from './schedule.service';
import { TeacherStudentGroups } from './schedule.type';

@UseGuards(AuthGuard)
@Controller('schedule')
export class ScheduleController {
	constructor(private readonly scheduleService: ScheduleService) {}

	/*
	 * Student Group
	 */
	@Roles('admin')
	@Get('/group/:id')
	async getStudentGroup(
		@Param('id', ParseIntPipe) id: number,
	): Promise<StudentGroup> {
		return await this.scheduleService.getStudentGroup(id);
	}

	@Roles('admin')
	@Get('/group')
	async getStudentGroups(): Promise<StudentGroup[]> {
		return await this.scheduleService.getStudentGroups();
	}

	@Roles('admin')
	@Post('/group')
	async createStudentGroup(
		@Body() studentGroupDto: StudentGroupDto,
	): Promise<StudentGroup> {
		return await this.scheduleService.createStudentGroup(studentGroupDto);
	}

	@Roles('admin')
	@Put('/group/:id')
	async updateStudentGroup(
		@Param('id', ParseIntPipe) id: number,
		@Body() studentGroupDto: Partial<StudentGroupDto>,
	): Promise<WithMsg> {
		await this.scheduleService.updateStudentGroup(id, studentGroupDto);
		return successResponse;
	}

	@Roles('admin')
	@Delete('/group/:id')
	async removeStudentGroup(
		@Param('id', ParseIntPipe) id: number,
	): Promise<WithMsg> {
		await this.scheduleService.removeStudentGroup(id);
		return successResponse;
	}

	/*
	 * Discipline
	 */
	@Roles('admin')
	@Get('/discipline/:id')
	async getDiscipline(
		@Param('id', ParseIntPipe) id: number,
	): Promise<Discipline> {
		return await this.scheduleService.getDiscipline(id);
	}

	@Roles('admin')
	@Get('/discipline')
	async getDisciplines(): Promise<Discipline[]> {
		return await this.scheduleService.getDisciplines();
	}

	@Roles('admin')
	@Post('/discipline')
	async createDiscipline(
		@Body() disciplineDto: DisciplineDto,
	): Promise<Discipline> {
		return await this.scheduleService.createDiscipline(disciplineDto);
	}

	@Roles('admin')
	@Put('/discipline/:id')
	async updateDiscipline(
		@Param('id', ParseIntPipe) id: number,
		@Body() disciplineDto: Partial<DisciplineDto>,
	): Promise<WithMsg> {
		await this.scheduleService.updateDiscipline(id, disciplineDto);
		return successResponse;
	}

	@Roles('admin')
	@Delete('/discipline/:id')
	async removeDiscipline(
		@Param('id', ParseIntPipe) id: number,
	): Promise<WithMsg> {
		await this.scheduleService.removeDiscipline(id);
		return successResponse;
	}

	/*
	 * Lesson
	 */
	@Roles('admin')
	@Get('/lesson/:id')
	async getLesson(@Param('id', ParseIntPipe) id: number): Promise<Lesson> {
		return await this.scheduleService.getLesson(id);
	}

	@Roles('admin')
	@Get('/lesson')
	async getLessons(): Promise<Lesson[]> {
		return await this.scheduleService.getLessons();
	}

	@Roles('admin')
	@Post('/lesson')
	async createLesson(@Body() lessonDto: LessonDto): Promise<Lesson> {
		return await this.scheduleService.createLesson(lessonDto);
	}

	@Roles('admin')
	@Put('/lesson/:id')
	async updateLesson(
		@Param('id', ParseIntPipe) id: number,
		@Body() lessonDto: Partial<LessonDto>,
	): Promise<WithMsg> {
		await this.scheduleService.updateLesson(id, lessonDto);
		return successResponse;
	}

	@Roles('admin')
	@Delete('/lesson/:id')
	async removeLesson(@Param('id', ParseIntPipe) id: number): Promise<WithMsg> {
		await this.scheduleService.removeLesson(id);
		return successResponse;
	}

	/*
	 * LessonTime
	 */
	@Roles('admin')
	@Get('/lesson-time/:id')
	async getLessonTime(
		@Param('id', ParseIntPipe) id: number,
	): Promise<LessonTime> {
		return await this.scheduleService.getLessonTime(id);
	}

	@Roles('admin')
	@Get('/lesson-time')
	async getLessonsTimes(): Promise<LessonTime[]> {
		return await this.scheduleService.getLessonsTimes();
	}

	@Roles('admin')
	@Post('/lesson-time')
	async createLessonTime(
		@Body() lessonTimeDto: LessonTimeDto,
	): Promise<LessonTime> {
		return await this.scheduleService.createLessonTime(lessonTimeDto);
	}

	@Roles('admin')
	@Put('/lesson-time/:id')
	async updateLessonTime(
		@Param('id', ParseIntPipe) id: number,
		@Body() lessonTimeDto: Partial<LessonTimeDto>,
	): Promise<WithMsg> {
		await this.scheduleService.updateLessonTime(id, lessonTimeDto);
		return successResponse;
	}

	@Roles('admin')
	@Delete('/lesson-time/:id')
	async removeLessonTime(
		@Param('id', ParseIntPipe) id: number,
	): Promise<WithMsg> {
		await this.scheduleService.removeLessonTime(id);
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

	@Get('/student-group/:id')
	async getStudentGroupSchedule(
		@Param('id', ParseIntPipe) id: number,
	): Promise<Lesson[]> {
		return await this.scheduleService.getStudentGroupSchedule(id);
	}

	@Get('/')
	@Roles('teacher', 'student')
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
	): Promise<TeacherStudentGroups[]> {
		return await this.scheduleService.getTeacherStudentGroups(id);
	}

	@Get('/student/:id/disciplines')
	async getStudentDisciplines(
		@Param('id', ParseIntPipe) id: number,
	): Promise<Discipline[]> {
		return await this.scheduleService.getStudentDisciplines(id);
	}

	@Get('/student/:id/performance')
	async getStudentPerformance(
		@Param('id', ParseIntPipe) id: number,
	): Promise<Discipline[]> {
		return await this.scheduleService.getStudentPerformance(id);
	}

	@Get('/performance/:groupid/:disciplineid')
	async getStudentGroupPerformance(
		@Param('groupid', ParseIntPipe) studentGroupId: number,
		@Param('disciplineid', ParseIntPipe) disciplineId: number,
	) {
		return await this.scheduleService.getStudentGroupPerformance(
			studentGroupId,
			disciplineId,
		);
	}

	@Get('/teacher-groups/')
	async getStudentGroupsTeachers(): Promise<{
		teachers: Teacher[];
		studentGroups: StudentGroup[];
	}> {
		return await this.scheduleService.getStudentGroupsTeachers();
	}
}
