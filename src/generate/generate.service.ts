import { Injectable } from '@nestjs/common';
import { RolesService } from 'src/roles/roles.service';
import { UsersService } from 'src/users/users.service';
import { RoleData, TeacherStudentUsers } from './generate.types';
import { transliterate, generatePassword } from '../utils';
import { UserDto, UserRole } from 'src/users/dto/user.dto';
import { Student } from 'src/roles/entity/student';
import { Teacher } from 'src/roles/entity/teacher';

@Injectable()
export class GenerateService {
	constructor(
		private readonly rolesService: RolesService,
		private readonly usersService: UsersService,
	) {}

	// async generateUsers(): Promise<TeacherStudentUsers> {
	async generateUsers(): Promise<any> {
		const result = {
			teachers: [],
			students: [],
		};

		const students = await this.rolesService.getStudents({
			order: {
				id: 'ASC',
			},
		});

		for (const student of students) {
			const user: UserDto & RoleData<Student> = {
				username: transliterate(student.recordBook).toLowerCase(),
				password: generatePassword(16),
				role: UserRole.STUDENT,
				roleId: student.id,
				roleData: student,
			};

			result.students.push(user);
		}

		const teachers = await this.rolesService.getTeachers({
			order: {
				id: 'ASC',
			},
		});

		for (const teacher of teachers) {
			let teacherLogin = transliterate(teacher.fullname.replace(/[ .]/g, '')).toLowerCase();

			const alreadyUser = await this.usersService.getUserByUsername(teacherLogin, false);
			if (alreadyUser) {
				teacherLogin += teacher.id;
			}

			const user: UserDto & RoleData<Teacher> = {
				username: teacherLogin,
				password: generatePassword(16),
				role: UserRole.TEACHER,
				roleId: teacher.id,
				roleData: teacher,
			};

			result.teachers.push(user);
		}

		return result;
	}
}
