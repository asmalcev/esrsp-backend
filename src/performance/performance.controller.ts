import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseIntPipe,
	Post,
	Put,
} from '@nestjs/common';
import { WithMsg } from 'src/common-types';
import { PerformanceDto } from './dto/performance.dto';
import { Performance } from './entity/performance';
import { PerformanceService } from './performance.service';

type PerformanceUpdateResponse = WithMsg & {};
type PerformanceRemoveResponse = WithMsg & {};

@Controller('performance')
export class PerformanceController {
	constructor(private readonly performanceService: PerformanceService) {}

	@Get('/:id')
	async getPerformance(
		@Param('id', ParseIntPipe) id: number,
	): Promise<Performance> {
		return this.performanceService.getPerformance(id);
	}

	@Post('/')
	async createPerformance(
		@Body() PerformanceDto: PerformanceDto,
	): Promise<Performance> {
		return this.performanceService.createPerformance(PerformanceDto);
	}

	@Put('/:id')
	async updatePerformance(
		@Param('id', ParseIntPipe) id: number,
		@Body() PerformanceDto: Partial<PerformanceDto>,
	): Promise<PerformanceUpdateResponse> {
		this.performanceService.updatePerformance(id, PerformanceDto);
		return {
			msg: 'success',
		};
	}

	@Delete('/:id')
	async removePerformance(
		@Param('id', ParseIntPipe) id: number,
	): Promise<PerformanceRemoveResponse> {
		this.performanceService.removePerformance(id);
		return {
			msg: 'success',
		};
	}
}
