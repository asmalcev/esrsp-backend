import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import entities from './entities';

import { appConfig } from './config/app.config';

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
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
