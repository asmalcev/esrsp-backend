import {
	forwardRef,
	Inject,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ScheduleService } from 'src/schedule/schedule.service';
import { Repository } from 'typeorm';
import { StudentDto } from './dto/student.dto';
import { TeacherDto } from './dto/teacher.dto';
import { Student } from './entity/student';
import { Teacher } from './entity/teacher';

@Injectable()
export class RolesService {
	constructor(
		@InjectRepository(Student)
		private readonly studentRepository: Repository<Student>,
		@InjectRepository(Teacher)
		private readonly teacherRepository: Repository<Teacher>,
		@Inject(forwardRef(() => ScheduleService))
		private readonly scheduleService: ScheduleService,
	) {}

	/*
	 * Student
	 */
	async createStudent(studentDto: StudentDto): Promise<Student> {
		if (studentDto.studentGroupId) {
			const studentGroup = await this.scheduleService.getStudentGroup(
				studentDto.studentGroupId,
			);
			return this.studentRepository.save({
				...studentDto,
				studentGroup,
			});
		}
		return this.studentRepository.save({ ...studentDto });
	}

	async getStudent(id: number): Promise<Student> {
		const student = this.studentRepository.findOne({ where: { id } });

		if (!student) {
			throw new NotFoundException('student is not found');
		}

		return student;
	}

	async updateStudent(
		id: number,
		studentDto: Partial<StudentDto>,
	): Promise<void> {
		if (studentDto.studentGroupId) {
			const studentGroup = await this.scheduleService.getStudentGroup(
				studentDto.studentGroupId,
			);
			this.studentRepository.update(
				{ id },
				{
					...studentDto,
					studentGroup,
				},
			);
		} else {
			this.studentRepository.update({ id }, { ...studentDto });
		}
	}

	async removeStudent(id: number): Promise<void> {
		this.studentRepository.delete({ id });
	}

	/*
	 * Teacher
	 */
	async createTeacher(teacherDto: TeacherDto): Promise<Teacher> {
		return this.teacherRepository.save({ ...teacherDto });
	}

	async getTeacher(id: number): Promise<Teacher> {
		const teacher = this.teacherRepository.findOne({ where: { id } });

		if (!teacher) {
			throw new NotFoundException('teacher is not found');
		}

		return teacher;
	}

	async updateTeacher(
		id: number,
		teacherDto: Partial<TeacherDto>,
	): Promise<void> {
		this.teacherRepository.update({ id }, { ...teacherDto });
	}

	async removeTeacher(id: number): Promise<void> {
		this.teacherRepository.delete({ id });
	}
}
