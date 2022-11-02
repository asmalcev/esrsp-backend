import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from 'src/roles/entity/student';
import { RolesService } from 'src/roles/roles.service';
import { Discipline } from 'src/schedule/entity/discipline';
import { ScheduleService } from 'src/schedule/schedule.service';
import { Repository } from 'typeorm';
import { PerformanceDto } from './dto/performance.dto';
import { Performance } from './entity/performance';

@Injectable()
export class PerformanceService {
	constructor(
		@InjectRepository(Performance)
		private readonly performanceRepository: Repository<Performance>,
		private readonly rolesService: RolesService,
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

		return await this.performanceRepository.save({
			...performanceDto,
			student,
			discipline,
		});
	}

	async getPerformance(id: number): Promise<Performance> {
		const performance = await this.performanceRepository.findOne({ where: { id } });

		if (!performance) {
			throw new NotFoundException('performance is not found');
		}

		return performance;
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

		this.performanceRepository.update(
			{ id },
			{
				...performanceDto,
				...other,
			},
		);
	}

	async removePerformance(id: number): Promise<void> {
		this.performanceRepository.delete({ id });
	}
}
