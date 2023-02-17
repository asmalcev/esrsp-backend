import {
	BadRequestException,
	forwardRef,
	Inject,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from 'src/roles/entity/student';
import { RolesService } from 'src/roles/roles.service';
import { Discipline } from 'src/schedule/entity/discipline';
import { ScheduleService } from 'src/schedule/schedule.service';
import {
	FindManyOptions,
	FindOneOptions,
	QueryFailedError,
	Repository,
} from 'typeorm';
import { PerformanceDto } from './dto/performance.dto';
import { Performance } from './entity/performance';

@Injectable()
export class PerformanceService {
	constructor(
		@InjectRepository(Performance)
		private readonly performanceRepository: Repository<Performance>,
		@Inject(forwardRef(() => RolesService))
		private readonly rolesService: RolesService,
		@Inject(forwardRef(() => ScheduleService))
		private readonly scheduleService: ScheduleService,
	) {}

	async createPerformance(
		performanceDto: PerformanceDto,
	): Promise<Performance> {
		const student: Student = await this.rolesService.getStudent(
			performanceDto.studentId,
		);
		const discipline: Discipline = await this.scheduleService.getDiscipline(
			performanceDto.disciplineId,
		);

		let performance;
		try {
			performance = await this.performanceRepository.save({
				...performanceDto,
				student,
				discipline,
			});
		} catch (e) {
			throw new BadRequestException(
				'date and discipline must be unique at the same time',
			);
		}

		return performance;
	}

	async getPerformance(
		id: number,
		other?: Omit<FindOneOptions<Performance>, 'where'>,
	): Promise<Performance> {
		const performance = await this.performanceRepository.findOne({
			where: { id },
			...other,
		});

		if (!performance) {
			throw new NotFoundException('performance is not found');
		}

		return performance;
	}

	async getPerformances(
		other?: FindManyOptions<Performance>,
	): Promise<Performance[]> {
		return await this.performanceRepository.find({
			...other,
		});
	}

	async updatePerformance(
		id: number,
		performanceDto: Partial<PerformanceDto>,
	): Promise<void> {
		const other: {
			student?: Student;
			discipline?: Discipline;
		} = {};

		if (performanceDto.studentId) {
			other.student = await this.rolesService.getStudent(
				performanceDto.studentId,
			);
		}
		if (performanceDto.disciplineId) {
			other.discipline = await this.scheduleService.getDiscipline(
				performanceDto.disciplineId,
			);
		}

		await this.performanceRepository.update(
			{ id },
			{
				...performanceDto,
				...other,
			},
		);
	}

	async removePerformance(id: number): Promise<void> {
		await this.performanceRepository.delete({ id });
	}
}
