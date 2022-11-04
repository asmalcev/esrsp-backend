import {
	forwardRef,
	Inject,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StudentGroup } from 'src/schedule/entity/student-group';
import { ScheduleService } from 'src/schedule/schedule.service';
import { FindOneOptions, InsertResult, Repository } from 'typeorm';
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
		const other: {
			studentGroup?: StudentGroup;
		} = {};

		if (studentDto.studentGroupId) {
			other.studentGroup = await this.scheduleService.getStudentGroup(
				studentDto.studentGroupId,
			);
		}

		return await this.studentRepository.save({
			...studentDto,
			...other,
		});
	}

	async createStudents(studentDtos: StudentDto[]): Promise<void> {
		for (const studentDto of studentDtos) {
			await this.createStudent(studentDto);
		}
	}

	async getStudent(
		id: number,
		other?: Omit<FindOneOptions<Student>, 'where'>,
	): Promise<Student> {
		const student = await this.studentRepository.findOne({
			where: { id },
			...other,
		});

		if (!student) {
			throw new NotFoundException('student is not found');
		}

		return student;
	}

	async updateStudent(
		id: number,
		studentDto: Partial<StudentDto>,
	): Promise<void> {
		const other: {
			studentGroup?: StudentGroup;
		} = {};

		if (studentDto.studentGroupId) {
			other.studentGroup = await this.scheduleService.getStudentGroup(
				studentDto.studentGroupId,
			);
		}

		this.studentRepository.update(
			{ id },
			{
				...studentDto,
				...other,
			},
		);
	}

	async removeStudent(id: number): Promise<void> {
		this.studentRepository.delete({ id });
	}

	async removeAllStudents(): Promise<void> {
		this.studentRepository.delete({});
	}

	/*
	 * Teacher
	 */
	async createTeacher(teacherDto: TeacherDto): Promise<Teacher> {
		return await this.teacherRepository.save({ ...teacherDto });
	}

	async createTeachers(teacherDtos: TeacherDto[]): Promise<InsertResult> {
		return await this.teacherRepository
			.createQueryBuilder()
			.insert()
			.into(Teacher)
			.values(teacherDtos)
			.execute();
	}

	async getTeacher(
		id: number,
		other?: Omit<FindOneOptions<Teacher>, 'where'>,
	): Promise<Teacher> {
		const teacher = await this.teacherRepository.findOne({
			where: { id },
			...other,
		});

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

	async removeAllTeachers(): Promise<void> {
		this.teacherRepository.delete({});
	}
}
