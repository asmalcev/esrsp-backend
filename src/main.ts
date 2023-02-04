import { ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import * as session from 'express-session';
import connectRedis from 'connect-redis';
import { createClient } from 'redis';

import { AppModule } from './app.module';
import { appConfig } from './config/app.config';
import { RolesGuard } from './roles/roles.guard';

const RedisStore = connectRedis(session);

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	const redisClient = createClient({ legacyMode: true });
	redisClient.connect().catch(console.error);

	app.useGlobalPipes(new ValidationPipe());
	app.useGlobalGuards(new RolesGuard(new Reflector()));
	app.use(
		session({
			store: new RedisStore({ client: redisClient }),
			secret: appConfig.getValue('SESSION_SECRET'),
			resave: false,
			saveUninitialized: false,
		}),
	);

	await app.listen(appConfig.getValue('PORT'));
}
bootstrap();
