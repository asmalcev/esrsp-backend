import {
	Body,
	Controller,
	Post,
	Get,
	Param,
	ParseIntPipe,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { UserDto, UserRole } from './dto/user.dto';
import { User } from './entity/user';
import { UsersService } from './users.service';

type UserSignup = {
	msg: string;
	userId: number;
	username: string;
	userRole?: UserRole;
};

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Post('/signup')
	async signup(@Body() userDto: UserDto): Promise<UserSignup> {
		const saltOrRounds = 10;
		const hashedPassword = await bcrypt.hash(userDto.password, saltOrRounds);

		const result = await this.usersService.createUser({
			...userDto,
			password: hashedPassword,
		});

		return {
			msg: 'User successfully registered',
			userId: result.id,
			username: result.username,
		};
	}

	/*
	 * Temporary Test Methods
	 */
	@Get('/')
	async getAll(): Promise<User[]> {
		return this.usersService.getAllUsers();
	}

	@Get('/:id')
	async getUserById(@Param('id', ParseIntPipe) id: number): Promise<User> {
		return this.usersService.getUserById(id);
	}
}
