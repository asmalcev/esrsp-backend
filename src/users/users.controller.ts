import {
	Body,
	Controller,
	Post,
	Get,
	Param,
	ParseIntPipe,
	UseGuards,
	Put,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthGuard } from 'src/auth/auth.guard';
import { WithMsg } from 'src/common-types';
import { Roles } from 'src/roles/roles.guard';
import { PartialUserDto, UserDto } from './dto/user.dto';
import { User } from './entity/user';
import { UsersService } from './users.service';

type UserSignupResponse = WithMsg & Omit<User, 'password'>;

type UserUpdateResponse = WithMsg & {};

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Post('/signup')
	async signup(@Body() userDto: UserDto): Promise<UserSignupResponse> {
		const saltOrRounds = 10;
		const hashedPassword = await bcrypt.hash(userDto.password, saltOrRounds);

		const { password, ...result} = await this.usersService.createUser({
			...userDto,
			password: hashedPassword,
		});

		return {
			msg: 'User successfully registered',
			...result,
		};
	}

	@Put('/:id')
	async updateUser(@Param('id', ParseIntPipe) id: number, @Body() userDto: PartialUserDto): Promise<UserUpdateResponse> {
		this.usersService.updateUser(id, userDto);
		return {
			msg: 'success'
		};
	}

	/*
	 * Temporary Test Methods
	 */
	@Get('/')
	@UseGuards(AuthGuard)
	async getAll(): Promise<User[]> {
		return this.usersService.getAllUsers();
	}

	@Get('/:id')
	@Roles('admin')
	async getUserById(@Param('id', ParseIntPipe) id: number): Promise<User> {
		return this.usersService.getUserById(id);
	}
}
