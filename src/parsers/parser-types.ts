import { TeacherDto } from 'src/roles/dto/teacher.dto';
import { DisciplineDto } from 'src/schedule/dto/discipline.dto';
import { StudentGroupDto } from 'src/schedule/dto/student-group.dto';

export namespace Parser {
	export type Teacher = {
		fullname?: string;
		id?: number;
	};

	export type Lesson = {
		disciplineName: string;
		teacherId: number;
		studentGroupNames: string[];
		lessonNumber: number;
		lessonDay: number;
		place: string;
	};

	export type IntermediateResult<T1, T2> = {
		lessons: Lesson[];
		groups: T1;
		teachers: T2;
		disciplines: T1;
	};

	export type Result = {
		lessons: Lesson[];
		groups: StudentGroupDto[];
		teachers: TeacherDto[];
		disciplines: DisciplineDto[];
	};
}
