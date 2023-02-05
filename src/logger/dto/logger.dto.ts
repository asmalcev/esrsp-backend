import { IsOptional, IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { LogType } from '../../log.type';

export class LoggerDto {
	@IsNotEmpty()
	@IsString()
	msg: string;

	@IsOptional()
	@IsEnum(LogType)
	type: LogType;

	constructor(message: string, logType: LogType = LogType.DEBUG) {
		this.msg = message;
		this.type = logType;
	}
}
