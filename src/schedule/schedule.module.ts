import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesModule } from 'src/roles/roles.module';
import { Discipline } from './entity/discipline';
import { Lesson } from './entity/lesson';
import { LessonTime } from './entity/lesson-time';
import { StudentGroup } from './entity/student-group';
import { ScheduleController } from './schedule.controller';
import { ScheduleService } from './schedule.service';

@Module({
	imports: [
		TypeOrmModule.forFeature([StudentGroup, Lesson, Discipline, LessonTime]),
		forwardRef(() => RolesModule),
	],
	controllers: [ScheduleController],
	providers: [ScheduleService],
	exports: [ScheduleService],
})
export class ScheduleModule {}
