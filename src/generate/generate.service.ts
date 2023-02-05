import { Injectable } from '@nestjs/common';
import { RolesService } from 'src/roles/roles.service';
import { UsersService } from 'src/users/users.service';
import { TeacherStudentUsers } from './generate.types';
import { transliterate, generatePassword } from '../utils';
import { UserRole } from 'src/users/dto/user.dto';
import { User } from 'src/users/entity/user';

@Injectable()
export class GenerateService {
	constructor(
		private readonly rolesService: RolesService,
		private readonly usersService: UsersService,
	) {}

	async generateUsers(): Promise<TeacherStudentUsers> {
		await this.usersService.removeAllUsers();

		const result: TeacherStudentUsers = {
			teachers: [],
			students: [],
		};

		const students = await this.rolesService.getStudents({
			order: {
				id: 'ASC',
			},
		});

		for (const student of students) {
			const password = generatePassword(16);
			const user: User = await this.usersService.createUser({
				username: transliterate(student.recordBook).toLowerCase(),
				password,
				role: UserRole.STUDENT,
				roleId: student.id,
			});

			result.students.push({
				...user,
				password,
				roleData: student,
			});
		}

		const teachers = await this.rolesService.getTeachers({
			order: {
				id: 'ASC',
			},
		});

		for (const teacher of teachers) {
			const password = generatePassword(16);
			let teacherLogin = transliterate(
				teacher.fullname.replace(/[ .]/g, ''),
			).toLowerCase();

			const alreadyUser = await this.usersService.getUserByUsername(
				teacherLogin,
				false,
			);
			if (alreadyUser) {
				teacherLogin += teacher.id;
			}

			const user: User = await this.usersService.createUser({
				username: teacherLogin,
				password: password,
				role: UserRole.TEACHER,
				roleId: teacher.id,
			});

			result.teachers.push({
				...user,
				password,
				roleData: teacher,
			});
		}

		return result;
	}
}
