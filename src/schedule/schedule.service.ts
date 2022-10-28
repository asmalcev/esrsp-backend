import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
	) {}

	/*
	 * Student Group
	 */
	async createStudentGroup(studentGroupDto: StudentGroupDto): Promise<StudentGroup> {
		return this.studentGroupsRepository.save({ ...studentGroupDto });
	}

	async getStudentGroup(id: number): Promise<StudentGroup> {
		const studentGroup = this.studentGroupsRepository.findOne({ where: { id } });

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
	async createLesson(lessonDto: LessonDto): Promise<Lesson> {
		return this.lessonsRepository.save({ ...lessonDto });
	}

	async getLesson(id: number): Promise<Lesson> {
		const lesson = this.lessonsRepository.findOne({ where: { id } });

		if (!lesson) {
			throw new NotFoundException('lesson is not found');
		}

		return lesson;
	}

	async updateLesson(
		id: number,
		lessonDto: Partial<LessonDto>,
	): Promise<void> {
		this.lessonsRepository.update({ id }, { ...lessonDto });
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
