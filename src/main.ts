import { ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import * as session from 'express-session';

import { AppModule } from './app.module';
import { appConfig } from './config/app.config';
import { RolesGuard } from './roles/roles.guard';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createClient } = require('redis');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const RedisStore = require('connect-redis')(session);

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
