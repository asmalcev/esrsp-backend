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
import { StudentDto } from './dto/student.dto';
import { TeacherDto } from './dto/teacher.dto';
import { Student } from './entity/student';
import { Teacher } from './entity/teacher';
import { RolesService } from './roles.service';

type StudentUpdateResponse = WithMsg & {};
type StudentRemoveResponse = WithMsg & {};

type TeacherUpdateResponse = WithMsg & {};
type TeacherRemoveResponse = WithMsg & {};

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

	@Post('/student')
	async createStudent(@Body() studentDto: StudentDto): Promise<Student> {
		return this.rolesService.createStudent(studentDto);
	}

	@Put('/student/:id')
	async updateStudent(
		@Param('id', ParseIntPipe) id: number,
		@Body() studentDto: Partial<StudentDto>,
	): Promise<StudentUpdateResponse> {
		this.rolesService.updateStudent(id, studentDto);
		return {
			msg: 'success',
		};
	}

	@Delete('/student/:id')
	async removeStudent(
		@Param('id', ParseIntPipe) id: number,
	): Promise<StudentRemoveResponse> {
		this.rolesService.removeStudent(id);
		return {
			msg: 'success',
		};
	}

	/*
	 * Teacher
	 */
	@Get('/teacher/:id')
	async getTeacher(@Param('id', ParseIntPipe) id: number): Promise<Teacher> {
		return this.rolesService.getTeacher(id);
	}

	@Post('/teacher')
	async createTeacher(@Body() teacherDto: TeacherDto): Promise<Teacher> {
		return this.rolesService.createTeacher(teacherDto);
	}

	@Put('/teacher/:id')
	async updateTeacher(
		@Param('id', ParseIntPipe) id: number,
		@Body() teacherDto: Partial<TeacherDto>,
	): Promise<TeacherUpdateResponse> {
		this.rolesService.updateTeacher(id, teacherDto);
		return {
			msg: 'success',
		};
	}

	@Delete('/teacher/:id')
	async removeTeacher(
		@Param('id', ParseIntPipe) id: number,
	): Promise<TeacherRemoveResponse> {
		this.rolesService.removeTeacher(id);
		return {
			msg: 'success',
		};
	}
}
