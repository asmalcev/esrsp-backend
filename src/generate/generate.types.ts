import { Student } from 'src/roles/entity/student';
import { Teacher } from 'src/roles/entity/teacher';
import { User } from 'src/users/entity/user';

export type RoleData<T> = {
	roleData: T;
};

export type TeacherStudentUsers = {
	teachers: (User & RoleData<Teacher>)[];
	students: (User & RoleData<Student>)[];
};
