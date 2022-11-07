import {
	Body,
	Controller,
	Get,
	Post,
	Session,
	UseGuards,
} from '@nestjs/common';
import { successResponse } from 'src/common-responses';
import { WithMsg } from 'src/common-types';
import { AuthGuard } from './auth.guard';
import { AuthService, ValidatedUser } from './auth.service';
import { AuthUserDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('/login')
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

	@Post('/logout')
	logout(@Session() session: Record<string, any>): WithMsg {
		session.destroy();
		return successResponse;
	}

	@UseGuards(AuthGuard)
	@Get('/')
	checkSession(): WithMsg {
		return successResponse;
	}
}
