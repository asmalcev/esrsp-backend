import { Body, Controller, Post, Session } from '@nestjs/common';
import { AuthService, ValidatedUser } from './auth.service';
import { AuthUserDto } from './dto/auth.dto';

type LoginResponse = ValidatedUser & {
	msg: string;
};

type LogoutResponse = {
	msg: string;
};

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('/login')
	async login(
		@Body() authUserDto: AuthUserDto,
		@Session() session: Record<string, any>,
	): Promise<LoginResponse> {
		const user = await this.authService.validateUser(authUserDto);

		session.user = user;
		return {
			msg: 'success',
			...user,
		};
	}

	@Post('/logout')
	logout(@Session() session: Record<string, any>): LogoutResponse {
		session.destroy();
		return { msg: 'success' };
	}
}
