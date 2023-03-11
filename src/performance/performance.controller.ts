import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseIntPipe,
	Post,
	Put,
	UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { successResponse } from 'src/common-responses';
import { WithMsg } from 'src/common-types';
import { Roles } from 'src/roles/roles.guard';
import { PerformanceDto } from './dto/performance.dto';
import { Performance } from './entity/performance';
import { PerformanceService } from './performance.service';

@UseGuards(AuthGuard)
@Roles('admin', 'teacher')
@Controller('performance')
export class PerformanceController {
	constructor(private readonly performanceService: PerformanceService) {}

	@Get('/:id')
	async getPerformance(
		@Param('id', ParseIntPipe) id: number,
	): Promise<Performance> {
		return await this.performanceService.getPerformance(id);
	}

	@Get('/')
	async getPerformances(): Promise<Performance[]> {
		return await this.performanceService.getPerformances();
	}

	@Post('/')
	async createPerformance(
		@Body() PerformanceDto: PerformanceDto,
	): Promise<Performance> {
		return await this.performanceService.createPerformance(PerformanceDto);
	}

	@Put('/:id')
	async updatePerformance(
		@Param('id', ParseIntPipe) id: number,
		@Body() PerformanceDto: Partial<PerformanceDto>,
	): Promise<WithMsg> {
		await this.performanceService.updatePerformance(id, PerformanceDto);
		return successResponse;
	}

	@Delete('/:id')
	async removePerformance(
		@Param('id', ParseIntPipe) id: number,
	): Promise<WithMsg> {
		await this.performanceService.removePerformance(id);
		return successResponse;
	}
}
