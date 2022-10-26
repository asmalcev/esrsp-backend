import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import entities from './entities';

import { appConfig } from './config/app.config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
	imports: [
		TypeOrmModule.forRoot({
			type: 'postgres',
			host: 'localhost',
			port: Number(appConfig.getValue('POSTGRES_PORT')),
			username: appConfig.getValue('POSTGRES_USERNAME'),
			password: appConfig.getValue('POSTGRES_PASSWORD'),
			database: appConfig.getValue('POSTGRES_DATABASE'),
			entities: [...entities],
			synchronize: true,
		}),
		UsersModule,
		AuthModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
