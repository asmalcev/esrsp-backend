import {
	Body,
	Controller,
	Post,
	Get,
	Param,
	ParseIntPipe,
	UseGuards,
	Put,
	Delete,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { WithMsg } from 'src/common-types';
import { Roles } from 'src/roles/roles.guard';
import { UserDto } from './dto/user.dto';
import { User } from './entity/user';
import { UsersService } from './users.service';

type UserSignupResponse = WithMsg & Omit<User, 'password'>;

type UserUpdateResponse = WithMsg & {};
type UserRemoveResponse = WithMsg & {};

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Post('/signup')
	async signup(@Body() userDto: UserDto): Promise<UserSignupResponse> {
		const { password, ...result } = await this.usersService.createUser(userDto);

		return {
			msg: 'User successfully registered',
			...result,
		};
	}

	@Put('/:id')
	async updateUser(
		@Param('id', ParseIntPipe) id: number,
		@Body() userDto: Partial<UserDto>,
	): Promise<UserUpdateResponse> {
		this.usersService.updateUser(id, userDto);
		return {
			msg: 'success',
		};
	}

	@Delete('/:id')
	async removeUser(
		@Param('id', ParseIntPipe) id: number,
	): Promise<UserRemoveResponse> {
		this.usersService.removeUser(id);
		return {
			msg: 'success',
		};
	}

	/*
	 * Temporary Test Methods
	 */
	@Get('/')
	// @UseGuards(AuthGuard)
	async getAll(): Promise<User[]> {
		return this.usersService.getAllUsers();
	}

	@Get('/:id')
	// @Roles('admin')
	async getUserById(@Param('id', ParseIntPipe) id: number): Promise<User> {
		return this.usersService.getUserById(id);
	}
}
