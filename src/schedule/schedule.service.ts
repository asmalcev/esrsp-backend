import {
	forwardRef,
	Inject,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Teacher } from 'src/roles/entity/teacher';
import { RolesService } from 'src/roles/roles.service';
import { Repository } from 'typeorm';
import { DisciplineDto } from './dto/discipline.dto';
import { LessonDto } from './dto/lesson.dto';
import { StudentGroupDto } from './dto/student-group.dto';
import { Discipline } from './entity/discipline';
import { Lesson } from './entity/lesson';
import { StudentGroup } from './entity/student-group';

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
		return this.studentGroupsRepository.save({ ...studentGroupDto });
	}

	async getStudentGroup(id: number): Promise<StudentGroup> {
		const studentGroup = this.studentGroupsRepository.findOne({
			where: { id },
		});

		if (!studentGroup) {
			throw new NotFoundException('student group is not found');
		}

		return studentGroup;
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

	/*
	 * Lesson
	 */
	async createLesson(lessonDto: LessonDto): Promise<any> {
		const studentGroups = await Promise.all(
			lessonDto.studentGroupIds.map((id) => this.getStudentGroup(id)),
		);
		const discipline = await this.getDiscipline(lessonDto.disciplineId);
		const teacher = await this.rolesService.getTeacher(lessonDto.teacherId);

		return this.lessonsRepository.save({
			...lessonDto,
			studentGroups,
			discipline,
			teacher,
		});
	}

	async getLesson(id: number): Promise<Lesson> {
		const lesson = this.lessonsRepository.findOne({ where: { id } });

		if (!lesson) {
			throw new NotFoundException('lesson is not found');
		}

		return lesson;
	}

	async updateLesson(id: number, lessonDto: Partial<LessonDto>): Promise<void> {
		const other: {
			studentGroups?: StudentGroup[];
			discipline?: Discipline;
			teacher?: Teacher;
		} = {};

		if (lessonDto.studentGroupIds) {
			other.studentGroups = await Promise.all(
				lessonDto.studentGroupIds.map((id) => this.getStudentGroup(id)),
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

	/*
	 * Discipline
	 */
	async createDiscipline(disciplineDto: DisciplineDto): Promise<Discipline> {
		return this.disciplinesRepository.save({ ...disciplineDto });
	}

	async getDiscipline(id: number): Promise<Discipline> {
		const discipline = this.disciplinesRepository.findOne({ where: { id } });

		if (!discipline) {
			throw new NotFoundException('discipline is not found');
		}

		return discipline;
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
}
