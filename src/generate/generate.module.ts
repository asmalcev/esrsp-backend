import { Module } from '@nestjs/common';
import { RolesModule } from 'src/roles/roles.module';
import { UsersModule } from 'src/users/users.module';
import { GenerateController } from './generate.controller';
import { GenerateService } from './generate.service';

@Module({
	imports: [RolesModule, UsersModule],
	controllers: [GenerateController],
	providers: [GenerateService],
})
export class GenerateModule {}
