import { Injectable, NestMiddleware } from '@nestjs/common';
import { writeLog } from '../utils';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
	use(req: any, res: any, next: () => void) {
		writeLog({
			msg: `${req.protocol} - ${req.method} - ${req.originalUrl}`,
			session: req.session,
		});

		next();
	}
}
