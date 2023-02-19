import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { RolesModule } from 'src/roles/roles.module';

@Module({
	imports: [UsersModule, RolesModule],
	providers: [AuthService],
	controllers: [AuthController],
})
export class AuthModule {}
