import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as session from 'express-session';

import { AppModule } from './app.module';
import { appConfig } from './config/app.config';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.useGlobalPipes(new ValidationPipe());
	app.use(
		session({
			secret: appConfig.getValue('SESSION_SECRET'),
			resave: false,
			saveUninitialized: false,
		})
	);

	await app.listen(3000);
}
bootstrap();
