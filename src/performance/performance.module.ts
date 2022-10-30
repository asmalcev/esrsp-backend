import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesModule } from 'src/roles/roles.module';
import { ScheduleModule } from 'src/schedule/schedule.module';
import { Performance } from './entity/performance';
import { PerformanceController } from './performance.controller';
import { PerformanceService } from './performance.service';

@Module({
	imports: [
		TypeOrmModule.forFeature([Performance]),
		RolesModule,
		ScheduleModule,
	],
	controllers: [PerformanceController],
	providers: [PerformanceService],
})
export class PerformanceModule {}
