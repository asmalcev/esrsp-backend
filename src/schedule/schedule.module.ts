import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Discipline } from './entity/discipline';
import { Lesson } from './entity/lesson';
import { StudentGroup } from './entity/student-group';
import { ScheduleController } from './schedule.controller';
import { ScheduleService } from './schedule.service';

@Module({
	imports: [
		TypeOrmModule.forFeature([StudentGroup, Lesson, Discipline])
	],
	controllers: [ScheduleController],
	providers: [ScheduleService],
	exports: [ScheduleService],
})
export class ScheduleModule {}
