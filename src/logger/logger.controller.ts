import { Body, Controller, HttpCode, Post, Session } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { LoggerDto } from './dto/logger.dto';

@Controller('logger')
export class LoggerController {
	constructor(private readonly loggerService: LoggerService) {}

	@Post('/write')
	@HttpCode(200)
	async write(
		@Body() loggerDto: LoggerDto,
		@Session() session: Record<string, any>,
	): Promise<string | void> {
		return await this.loggerService.writeClient(loggerDto, session);
	}
}
