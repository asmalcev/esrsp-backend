import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { ScheduleModule } from 'src/schedule/schedule.module';
import { RolesModule } from 'src/roles/roles.module';

@Module({
	imports: [ScheduleModule, RolesModule],
	providers: [UploadService],
	controllers: [UploadController],
})
export class UploadModule {}
