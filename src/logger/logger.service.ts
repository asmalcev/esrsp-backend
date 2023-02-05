import { Injectable } from '@nestjs/common';
import { LoggerDto } from './dto/logger.dto';
import { writeLog } from '../utils';

@Injectable()
export class LoggerService {
	async write(loggerDto: LoggerDto, session: Record<string, any> = {}) {
		const logMSG = writeLog({
			...loggerDto,
			session,
		});

		return logMSG;
	}

	async writeClient(loggerDto: LoggerDto, session: Record<string, any> = {}) {
		const logMSG = writeLog(
			{
				...loggerDto,
				session,
			},
			true,
		);

		return logMSG;
	}
}
