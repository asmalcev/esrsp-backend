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
	uploadVoenmehTimetable(@UploadedFile() file: Express.Multer.File) {
		this.uploadService.fillWithVoenmehTimetable(file.buffer.toString());
	}
}
