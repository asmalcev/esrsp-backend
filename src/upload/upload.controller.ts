import {
	Controller,
	Post,
	UploadedFile,
	UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { successResponse } from 'src/common-responses';
import { WithMsg } from 'src/common-types';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
	constructor(private readonly uploadService: UploadService) {}

	@Post('/timetable/voenmeh/xml')
	@UseInterceptors(FileInterceptor('file'))
	async uploadVoenmehTimetable(
		@UploadedFile() file: Express.Multer.File,
	): Promise<WithMsg> {
		await this.uploadService.removeAll();
		await this.uploadService.fillWithVoenmehTimetable(file.buffer.toString());
		return successResponse;
	}

	@Post('/timetable/json')
	@UseInterceptors(FileInterceptor('file'))
	async uploadTimetable(
		@UploadedFile() file: Express.Multer.File,
	): Promise<WithMsg> {
		await this.uploadService.removeAll();
		await this.uploadService.fillWithTimetable(file.buffer.toString());
		return successResponse;
	}

	@Post('/groups/json')
	@UseInterceptors(FileInterceptor('file'))
	async uploadStudentGroups(
		@UploadedFile() file: Express.Multer.File,
	): Promise<WithMsg> {
		await this.uploadService.fillWithStudentGroups(file.buffer.toString());
		return successResponse;
	}
}
