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
import { Student } from './entity/student';
import { RolesService } from './roles.service';

type StudentUpdateResponse = WithMsg & {};
type StudentRemoveResponse = WithMsg & {};

@Controller('roles')
export class RolesController {
	constructor(private readonly rolesService: RolesService) {}

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
}
