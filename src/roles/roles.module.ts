import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from 'src/schedule/schedule.module';
import { Student } from './entity/student';
import { Teacher } from './entity/teacher';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';

@Module({
	imports: [
		TypeOrmModule.forFeature([Student, Teacher]),
		ScheduleModule,
	],
	controllers: [RolesController],
	providers: [RolesService],
	exports: [RolesService],
})
export class RolesModule {}
