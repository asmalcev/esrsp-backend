import {
	forwardRef,
	Inject,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Performance } from 'src/performance/entity/performance';
import { PerformanceService } from 'src/performance/performance.service';
import { Student } from 'src/roles/entity/student';
import { Teacher } from 'src/roles/entity/teacher';
import { RolesService } from 'src/roles/roles.service';
import { getddmm } from 'src/utils';
import {
	FindManyOptions,
	FindOneOptions,
	InsertResult,
	Repository,
} from 'typeorm';
import { DisciplineDto } from './dto/discipline.dto';
import { LessonTimeDto } from './dto/lesson-time.dto';
import { LessonDto, LessonWithNamesDto } from './dto/lesson.dto';
import { StudentGroupDto } from './dto/student-group.dto';
import { Discipline } from './entity/discipline';
import { Lesson } from './entity/lesson';
import { LessonTime } from './entity/lesson-time';
import { StudentGroup } from './entity/student-group';
import lessonDaysToDates from './lessonDaysToDates';
import { TeacherStudentGroups, TimedLessons } from './schedule.type';

@Injectable()
export class ScheduleService {
	constructor(
		@InjectRepository(StudentGroup)
		private readonly studentGroupsRepository: Repository<StudentGroup>,
		@InjectRepository(Lesson)
		private readonly lessonsRepository: Repository<Lesson>,
		@InjectRepository(Discipline)
		private readonly disciplinesRepository: Repository<Discipline>,
		@InjectRepository(LessonTime)
		private readonly lessonTimeRepository: Repository<LessonTime>,
		@Inject(forwardRef(() => RolesService))
		private readonly rolesService: RolesService,
		@Inject(forwardRef(() => PerformanceService))
		private readonly performanceService: PerformanceService,
	) {}

	/*
	 * Student Group
	 */
	async createStudentGroup(
		studentGroupDto: StudentGroupDto,
	): Promise<StudentGroup> {
		return await this.studentGroupsRepository.save({ ...studentGroupDto });
	}

	async createStudentGroups(
		studentGroupDtos: StudentGroupDto[],
	): Promise<InsertResult> {
		return await this.studentGroupsRepository
			.createQueryBuilder()
			.insert()
			.into(StudentGroup)
			.values(studentGroupDtos)
			.execute();
	}

	async getStudentGroup(
		id: number,
		other: Omit<FindOneOptions<StudentGroup>, 'where'> = {
			relations: {
				students: true,
			},
		},
	): Promise<StudentGroup> {
		const studentGroup = await this.studentGroupsRepository.findOne({
			where: { id },
			...other,
		});

		if (!studentGroup) {
			throw new NotFoundException('student group is not found');
		}

		return studentGroup;
	}

	async getStudentGroupByName(
		name: string,
		other: Omit<FindOneOptions<StudentGroup>, 'where'> = {
			relations: {
				students: true,
			},
		},
	): Promise<StudentGroup> {
		const studentGroup = await this.studentGroupsRepository.findOne({
			where: { name },
			...other,
		});

		if (!studentGroup) {
			throw new NotFoundException('student group is not found');
		}

		return studentGroup;
	}

	async getStudentGroups(
		other?: FindManyOptions<StudentGroup>,
	): Promise<StudentGroup[]> {
		return await this.studentGroupsRepository.find({
			...other,
		});
	}

	async updateStudentGroup(
		id: number,
		studentGroupDto: Partial<StudentGroupDto>,
	): Promise<void> {
		await this.studentGroupsRepository.update({ id }, { ...studentGroupDto });
	}

	async removeStudentGroup(id: number): Promise<void> {
		await this.studentGroupsRepository.delete({ id });
	}

	async removeAllStudentGroups(): Promise<void> {
		await this.studentGroupsRepository.delete({});
	}

	/*
	 * Lesson
	 */
	async createLesson(lessonDto: LessonDto): Promise<Lesson> {
		const studentGroups = await Promise.all(
			lessonDto.studentGroupIds.map((id) => this.getStudentGroup(id, {})),
		);
		const discipline = await this.getDiscipline(lessonDto.disciplineId);
		const teacher = await this.rolesService.getTeacher(lessonDto.teacherId);

		return await this.lessonsRepository.save({
			...lessonDto,
			studentGroups,
			discipline,
			teacher,
		});
	}

	async createLessons(lessonDtos: LessonDto[]): Promise<void> {
		for (const lessonDto of lessonDtos) {
			await this.createLesson(lessonDto);
		}
	}

	async createLessonsByNames(lessonDtos: LessonWithNamesDto[]): Promise<void> {
		for (const lessonDto of lessonDtos) {
			const studentGroups = await Promise.all(
				lessonDto.studentGroupNames.map((name) =>
					this.getStudentGroupByName(name, {}),
				),
			);
			const discipline = await this.getDisciplineByName(
				lessonDto.disciplineName,
			);

			const teacher = lessonDto.teacherId
				? await this.rolesService.getTeacher(lessonDto.teacherId)
				: null;

			await this.lessonsRepository.save({
				...lessonDto,
				studentGroups,
				discipline,
				teacher,
			});
		}
	}

	async getLesson(
		id: number,
		other: Omit<FindOneOptions<Lesson>, 'where'> = {
			relations: {
				studentGroups: true,
				teacher: true,
				discipline: true,
			},
		},
	): Promise<Lesson> {
		const lesson = await this.lessonsRepository.findOne({
			where: { id },
			...other,
		});

		if (!lesson) {
			throw new NotFoundException('lesson is not found');
		}

		return lesson;
	}

	async getLessons(
		other: FindManyOptions<Lesson> = {
			relations: {
				studentGroups: true,
				teacher: true,
				discipline: true,
			},
		},
	): Promise<Lesson[]> {
		return await this.lessonsRepository.find({
			...other,
		});
	}

	async updateLesson(id: number, lessonDto: Partial<LessonDto>): Promise<void> {
		const other: {
			studentGroups?: StudentGroup[];
			discipline?: Discipline;
			teacher?: Teacher;
		} = {};

		if (lessonDto.studentGroupIds) {
			other.studentGroups = await Promise.all(
				lessonDto.studentGroupIds.map((id) => this.getStudentGroup(id, {})),
			);
		}
		if (lessonDto.disciplineId) {
			other.discipline = await this.getDiscipline(lessonDto.disciplineId);
		}
		if (lessonDto.teacherId) {
			other.teacher = await this.rolesService.getTeacher(lessonDto.teacherId);
		}

		await this.lessonsRepository.update({ id }, { ...lessonDto, ...other });
	}

	async removeLesson(id: number): Promise<void> {
		await this.lessonsRepository.delete({ id });
	}

	async removeAllLessons(): Promise<void> {
		await this.lessonsRepository.delete({});
	}

	/*
	 * Discipline
	 */
	async createDiscipline(disciplineDto: DisciplineDto): Promise<Discipline> {
		return await this.disciplinesRepository.save({ ...disciplineDto });
	}

	async createDisciplines(
		disciplineDtos: DisciplineDto[],
	): Promise<InsertResult> {
		return await this.disciplinesRepository
			.createQueryBuilder()
			.insert()
			.into(Discipline)
			.values(disciplineDtos)
			.execute();
	}

	async getDiscipline(
		id: number,
		other?: Omit<FindOneOptions<Discipline>, 'where'>,
	): Promise<Discipline> {
		const discipline = await this.disciplinesRepository.findOne({
			where: { id },
			...other,
		});

		if (!discipline) {
			throw new NotFoundException('discipline is not found');
		}

		return discipline;
	}

	async getDisciplineByName(
		name: string,
		other?: Omit<FindOneOptions<Discipline>, 'where'>,
	): Promise<Discipline> {
		const discipline = await this.disciplinesRepository.findOne({
			where: { name },
			...other,
		});

		if (!discipline) {
			throw new NotFoundException('discipline is not found');
		}

		return discipline;
	}

	async getDisciplines(
		other?: Omit<FindManyOptions<Discipline>, 'where'>,
	): Promise<Discipline[]> {
		return await this.disciplinesRepository.find({
			...other,
		});
	}

	async updateDiscipline(
		id: number,
		disciplineDto: Partial<DisciplineDto>,
	): Promise<void> {
		await this.disciplinesRepository.update({ id }, { ...disciplineDto });
	}

	async removeDiscipline(id: number): Promise<void> {
		await this.disciplinesRepository.delete({ id });
	}

	async removeAllDisciplines(): Promise<void> {
		await this.disciplinesRepository.delete({});
	}

	/*
	 * Lesson Time
	 */
	async createLessonTime(lessonTimeDto: LessonTimeDto): Promise<LessonTime> {
		return await this.lessonTimeRepository.save({ ...lessonTimeDto });
	}

	async createLessonsTimes(
		lessonTimeDtos: LessonTimeDto[],
	): Promise<InsertResult> {
		return await this.lessonTimeRepository
			.createQueryBuilder()
			.insert()
			.into(LessonTime)
			.values(lessonTimeDtos)
			.execute();
	}

	async getLessonTime(id: number): Promise<LessonTime> {
		const lessonTime: LessonTime = await this.lessonTimeRepository.findOne({
			where: { id },
		});

		if (!lessonTime) {
			throw new NotFoundException('lesson time is not found');
		}

		return lessonTime;
	}

	async getLessonsTimes(): Promise<LessonTime[]> {
		return await this.lessonTimeRepository.find();
	}

	async updateLessonTime(
		id: number,
		lessonTimeDto: Partial<LessonTimeDto>,
	): Promise<void> {
		await this.lessonTimeRepository.update({ id }, { ...lessonTimeDto });
	}

	async removeLessonTime(id: number): Promise<void> {
		await this.lessonTimeRepository.delete({ id });
	}

	async removeAllLessonsTimes(): Promise<void> {
		await this.lessonTimeRepository.delete({});
	}

	/*
	 * Schedule
	 */
	async getTeacherSchedule(id: number): Promise<TimedLessons> {
		const teacherSchedule: TimedLessons = await this.lessonsRepository.find({
			where: {
				teacher: { id },
			},
			relations: {
				teacher: true,
				discipline: true,
				studentGroups: true,
			},
			order: {
				lessonDay: 'ASC',
				lessonNumber: 'ASC',
			},
		});

		for (const lesson of teacherSchedule) {
			lesson.lessonTime = await this.getLessonTime(lesson.lessonNumber);
		}

		return teacherSchedule;
	}

	async getStudentSchedule(id: number): Promise<TimedLessons> {
		const studentSchedule: TimedLessons = await this.lessonsRepository.find({
			where: {
				studentGroups: {
					students: { id },
				},
			},
			relations: {
				teacher: true,
				discipline: true,
				studentGroups: true,
			},
			order: {
				lessonDay: 'ASC',
				lessonNumber: 'ASC',
			},
		});

		for (const lesson of studentSchedule) {
			lesson.lessonTime = await this.getLessonTime(lesson.lessonNumber);
		}

		return studentSchedule;
	}

	async getStudentGroupSchedule(id: number): Promise<TimedLessons> {
		const studentSchedule: TimedLessons = await this.lessonsRepository.find({
			where: {
				studentGroups: { id },
			},
			relations: {
				teacher: true,
				discipline: true,
				studentGroups: true,
			},
			order: {
				lessonDay: 'ASC',
				lessonNumber: 'ASC',
			},
		});

		for (const lesson of studentSchedule) {
			lesson.lessonTime = await this.getLessonTime(lesson.lessonNumber);
		}

		return studentSchedule;
	}

	async getTeacherStudentGroups(
		teacherId: number,
	): Promise<TeacherStudentGroups[]> {
		return await this.lessonsRepository.query(`
			select distinct
				"D"."name" as "discipline",
				"D"."id" as "disciplineId",
				"SG"."name" as "studentGroup",
				"SG"."id" as "studentGroupId"
			from "lesson" as "L"
			right join "lesson_student_groups_student-group" as "LSG" on "LSG"."lessonId" = "L"."id"
			join "student-group" as "SG" on "SG"."id" = "LSG"."studentGroupId"
			join "discipline" as "D" on "D"."id" = "L"."disciplineId"
			where "L"."teacherId" = ${teacherId}
			order by "D"."id", "SG"."id"
		`);
	}

	async getStudentDisciplines(id: number): Promise<Discipline[]> {
		return await this.disciplinesRepository.find({
			where: {
				lessons: {
					studentGroups: {
						students: {
							id,
						},
					},
				},
			},
			order: {
				id: 'ASC',
			},
		});
	}

	async getStudentGroupPerformance(
		studentGroupId: number,
		disciplineId: number,
	): Promise<any> {
		const { students, ...studentGroup } = await this.getStudentGroup(
			studentGroupId,
		);
		const discipline = await this.getDiscipline(disciplineId);

		const performance = await this.performanceService.getPerformances({
			where: {
				student: students,
				discipline: discipline,
			},
			relations: {
				student: true,
			},
		});

		const lessons = await this.getLessons({
			where: {
				studentGroups: studentGroup,
				discipline: discipline,
			},
		});

		const lessonDates = lessonDaysToDates(
			lessons.map((lesson) => lesson.lessonDay),
		);

		const tableHead = [studentGroup.name, ...lessonDates];

		const table: (Student | Performance)[][] = [];
		for (let i = 0; i < students.length; i++) {
			table.push(new Array(lessonDates.length).fill(null));
			table[i].unshift(students[i]);
		}

		performance.forEach((p) => {
			for (let j = 0; j < table.length; j++) {
				const student = table[j][0] as Student;

				if (student.id !== p.student.id) continue;

				for (let i = 1; i < table[0].length; i++) {
					const currentDate = tableHead[i];

					if (getddmm(p.date) === currentDate) {
						table[j][i] = p;
					}
				}
			}
		});

		return {
			studentGroup,
			discipline,
			tableHead,
			table,
		};
	}

	async getStudentPerformance(id: number) {
		const disciplines = await this.getStudentDisciplines(id);
		const performanceByDisciplines = await this.disciplinesRepository.find({
			where: {
				performances: {
					student: {
						id,
					},
				},
			},
			relations: {
				performances: true,
			},
		});

		for (const discipline of disciplines) {
			const index = performanceByDisciplines.findIndex(
				(d) => d.id === discipline.id,
			);
			if (index >= 0) {
				discipline.performances = performanceByDisciplines[index].performances;
			} else {
				discipline.performances = [];
			}
		}

		return disciplines;
	}
}
