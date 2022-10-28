import { ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import * as session from 'express-session';

import { AppModule } from './app.module';
import { appConfig } from './config/app.config';
import { RolesGuard } from './roles/roles.guard';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.useGlobalPipes(new ValidationPipe());
	app.useGlobalGuards(new RolesGuard(new Reflector()));
	app.use(
		session({
			secret: appConfig.getValue('SESSION_SECRET'),
			resave: false,
			saveUninitialized: false,
		}),
	);

	await app.listen(3000);
}
bootstrap();
