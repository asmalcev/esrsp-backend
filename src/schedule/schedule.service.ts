import {
	forwardRef,
	Inject,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Teacher } from 'src/roles/entity/teacher';
import { RolesService } from 'src/roles/roles.service';
import {
	FindManyOptions,
	FindOneOptions,
	InsertResult,
	Repository,
} from 'typeorm';
import { DisciplineDto } from './dto/discipline.dto';
import { LessonDto, LessonWithNamesDto } from './dto/lesson.dto';
import { StudentGroupDto } from './dto/student-group.dto';
import { Discipline } from './entity/discipline';
import { Lesson } from './entity/lesson';
import { StudentGroup } from './entity/student-group';
import { TeacherStudentGroups } from './schedule.type';

@Injectable()
export class ScheduleService {
	constructor(
		@InjectRepository(StudentGroup)
		private readonly studentGroupsRepository: Repository<StudentGroup>,
		@InjectRepository(Lesson)
		private readonly lessonsRepository: Repository<Lesson>,
		@InjectRepository(Discipline)
		private readonly disciplinesRepository: Repository<Discipline>,
		@Inject(forwardRef(() => RolesService))
		private readonly rolesService: RolesService,
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
		this.studentGroupsRepository.update({ id }, { ...studentGroupDto });
	}

	async removeStudentGroup(id: number): Promise<void> {
		this.studentGroupsRepository.delete({ id });
	}

	async removeAllStudentGroups(): Promise<void> {
		this.studentGroupsRepository.delete({});
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

		this.lessonsRepository.update({ id }, { ...lessonDto, ...other });
	}

	async removeLesson(id: number): Promise<void> {
		this.lessonsRepository.delete({ id });
	}

	async removeAllLessons(): Promise<void> {
		this.lessonsRepository.delete({});
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
		this.disciplinesRepository.update({ id }, { ...disciplineDto });
	}

	async removeDiscipline(id: number): Promise<void> {
		this.disciplinesRepository.delete({ id });
	}

	async removeAllDisciplines(): Promise<void> {
		this.disciplinesRepository.delete({});
	}

	/*
	 * Schedule
	 */
	async getTeacherSchedule(id: number): Promise<Lesson[]> {
		return await this.lessonsRepository.find({
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
	}

	async getStudentSchedule(id: number): Promise<Lesson[]> {
		return await this.lessonsRepository.find({
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
	}

	async getTeacherStudentGroups(
		teacherId: number,
	): Promise<TeacherStudentGroups[]> {
		return this.lessonsRepository.query(`
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

	async getStudentDisciplines(studentId: number): Promise<any> {
		return this.lessonsRepository.query(`
			select distinct
				"D"."name" as "discipline",
				"D"."id" as "disciplineId"
			from "lesson_student_groups_student-group" as "LSG"
			join "lesson" as "L" on "L"."id" = "LSG"."lessonId"
			join "discipline" as "D" on "D"."id" = "L"."disciplineId"
			where "LSG"."studentGroupId" = (
				select "S"."studentGroupId" from "student" as "S"
				where "S"."id" = ${studentId}
			)
			order by "D"."id"
		`);
	}
}
