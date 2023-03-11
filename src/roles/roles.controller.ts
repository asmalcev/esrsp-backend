import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseIntPipe,
	Post,
	Put,
	UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { successResponse } from 'src/common-responses';
import { WithMsg } from 'src/common-types';
import { StudentDto } from './dto/student.dto';
import { TeacherDto } from './dto/teacher.dto';
import { Student } from './entity/student';
import { Teacher } from './entity/teacher';
import { Roles } from './roles.guard';
import { RolesService } from './roles.service';

@UseGuards(AuthGuard)
@Roles('admin')
@Controller('roles')
export class RolesController {
	constructor(private readonly rolesService: RolesService) {}

	/*
	 * Student
	 */
	@Get('/student/:id')
	async getStudent(@Param('id', ParseIntPipe) id: number): Promise<Student> {
		return this.rolesService.getStudent(id);
	}

	@Get('/student')
	async getStudents(): Promise<Student[]> {
		return this.rolesService.getStudents();
	}

	@Post('/student')
	async createStudent(@Body() studentDto: StudentDto): Promise<Student> {
		return this.rolesService.createStudent(studentDto);
	}

	@Put('/student/:id')
	async updateStudent(
		@Param('id', ParseIntPipe) id: number,
		@Body() studentDto: Partial<StudentDto>,
	): Promise<WithMsg> {
		this.rolesService.updateStudent(id, studentDto);
		return successResponse;
	}

	@Delete('/student/:id')
	async removeStudent(@Param('id', ParseIntPipe) id: number): Promise<WithMsg> {
		this.rolesService.removeStudent(id);
		return successResponse;
	}

	/*
	 * Teacher
	 */
	@Get('/teacher/:id')
	async getTeacher(@Param('id', ParseIntPipe) id: number): Promise<Teacher> {
		return this.rolesService.getTeacher(id);
	}

	@Get('/teacher')
	async getTeachers(): Promise<Teacher[]> {
		return this.rolesService.getTeachers();
	}

	@Post('/teacher')
	async createTeacher(@Body() teacherDto: TeacherDto): Promise<Teacher> {
		return this.rolesService.createTeacher(teacherDto);
	}

	@Put('/teacher/:id')
	async updateTeacher(
		@Param('id', ParseIntPipe) id: number,
		@Body() teacherDto: Partial<TeacherDto>,
	): Promise<WithMsg> {
		this.rolesService.updateTeacher(id, teacherDto);
		return successResponse;
	}

	@Delete('/teacher/:id')
	async removeTeacher(@Param('id', ParseIntPipe) id: number): Promise<WithMsg> {
		this.rolesService.removeTeacher(id);
		return successResponse;
	}
}
