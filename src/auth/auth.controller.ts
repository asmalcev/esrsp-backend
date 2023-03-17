import {
	Body,
	Controller,
	Get,
	HttpCode,
	Post,
	Res,
	Session,
	UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { successResponse } from 'src/common-responses';
import { WithMsg } from 'src/common-types';
import { AuthGuard } from './auth.guard';
import { AuthService, ValidatedUser } from './auth.service';
import { AuthUserDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('/login')
	@HttpCode(200)
	async login(
		@Body() authUserDto: AuthUserDto,
		@Session() session: Record<string, any>,
	): Promise<ValidatedUser & WithMsg> {
		const user = await this.authService.validateUser(authUserDto);

		session.user = user;
		return {
			...successResponse,
			...user,
		};
	}

	@UseGuards(AuthGuard)
	@Post('/logout')
	logout(
		@Session() session: Record<string, any>,
		@Res() res: Response,
	): WithMsg {
		session.destroy();
		res.setHeader('cache-control', 'no-store, max-age=0');
		return successResponse;
	}

	@UseGuards(AuthGuard)
	@Get('/')
	checkSession(@Session() session: Record<string, any>): WithMsg {
		return {
			...session.user,
			...successResponse,
		};
	}
}
