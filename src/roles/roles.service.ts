import {
	forwardRef,
	Inject,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StudentGroup } from 'src/schedule/entity/student-group';
import { ScheduleService } from 'src/schedule/schedule.service';
import {
	FindManyOptions,
	FindOneOptions,
	InsertResult,
	Repository,
} from 'typeorm';
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
				{
					select: {
						id: true,
					},
				},
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
			relations: {
				studentGroup: true,
			},
			...other,
		});

		if (!student) {
			throw new NotFoundException('student is not found');
		}

		return student;
	}

	async getStudents(other?: FindManyOptions<Student>): Promise<Student[]> {
		return await this.studentRepository.find({
			relations: {
				studentGroup: true,
			},
			order: {
				id: 'ASC',
			},
			...other,
		});
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
				{
					select: {
						id: true,
					},
				},
			);
		}

		await this.studentRepository.update(
			{ id },
			{
				...studentDto,
				...other,
			},
		);
	}

	async removeStudent(id: number): Promise<void> {
		await this.studentRepository.delete({ id });
	}

	async removeAllStudents(): Promise<void> {
		await this.studentRepository.delete({});
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

	async getTeachers(other?: FindManyOptions<Teacher>): Promise<Teacher[]> {
		return await this.teacherRepository.find({
			order: {
				id: 'ASC',
			},
			...other,
		});
	}

	async updateTeacher(
		id: number,
		teacherDto: Partial<TeacherDto>,
	): Promise<void> {
		const { id: _, ...other } = teacherDto;
		await this.teacherRepository.update({ id }, { ...other });
	}

	async removeTeacher(id: number): Promise<void> {
		await this.teacherRepository.delete({ id });
	}

	async removeAllTeachers(): Promise<void> {
		await this.teacherRepository.delete({});
	}
}
