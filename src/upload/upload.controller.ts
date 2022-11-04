import {
	Controller,
	Post,
	UploadedFile,
	UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
	constructor(private readonly uploadService: UploadService) {}

	@Post('/timetable/voenmeh/xml')
	@UseInterceptors(FileInterceptor('file'))
	async uploadVoenmehTimetable(@UploadedFile() file: Express.Multer.File) {
		await this.uploadService.removeAll();
		await this.uploadService.fillWithVoenmehTimetable(file.buffer.toString());
		return {
			msg: 'success',
		};
	}

	@Post('/timetable/json')
	@UseInterceptors(FileInterceptor('file'))
	async uploadTimetable(@UploadedFile() file: Express.Multer.File) {
		await this.uploadService.removeAll();
		await this.uploadService.fillWithTimetable(file.buffer.toString());
		return {
			msg: 'success',
		};
	}

	@Post('/groups/json')
	@UseInterceptors(FileInterceptor('file'))
	async uploadStudentGroups(@UploadedFile() file: Express.Multer.File) {
		await this.uploadService.fillWithStudentGroups(file.buffer.toString());
		return {
			msg: 'success',
		};
	}
}
