import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { appConfig } from 'src/config/app.config';
import { UserDto, UserRole } from './dto/user.dto';
import { User } from './entity/user';
import { generatePassword } from 'src/utils';

const SelectFindOptions = {
	id: true,
	username: true,
	role: true,
	roleId: true,
};

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User)
		private readonly usersRepository: Repository<User>,
	) {
		this.createSuperUser();
	}

	async createSuperUser() {
		const username = appConfig.getValue('SUPERUSER_USERNAME');
		const password = appConfig.getValue('SUPERUSER_PASSWORD');

		const superuser = await this.getUserByUsername(username, false);

		if (!superuser) {
			await this.createUser({
				username,
				password,
				role: UserRole.ADMIN,
			});
		}
	}

	async createUser(userDto: UserDto): Promise<User> {
		const user = await this.getUserByUsername(userDto.username, false);

		if (user) {
			throw new BadRequestException('selected username is already taken');
		}

		const saltOrRounds = 10;
		userDto.password = await bcrypt.hash(userDto.password, saltOrRounds);

		return this.usersRepository.save({ ...userDto });
	}

	async getUserById(id: number): Promise<User> {
		const user = await this.usersRepository.findOne({
			where: { id },
			select: SelectFindOptions,
		});

		if (!user) {
			throw new NotFoundException('user is not found');
		}

		return user;
	}

	async getUserByUsername(username: string, throwErr = true): Promise<User> {
		const user = await this.usersRepository.findOne({ where: { username } });

		if (throwErr && !user) {
			throw new NotFoundException('user is not found');
		}

		return user;
	}

	async getAllUsers(): Promise<User[]> {
		return this.usersRepository.find({
			select: SelectFindOptions,
			order: {
				id: 'ASC',
			},
		});
	}

	async updateUser(id: number, userDto: Partial<UserDto>): Promise<void> {
		const { username, ...other } = userDto;

		const saltOrRounds = 10;
		other.password = await bcrypt.hash(userDto.password, saltOrRounds);

		await this.usersRepository.update({ id }, { ...other });
	}

	async removeUser(id: number): Promise<void> {
		await this.usersRepository.delete({ id });
	}

	async removeAllUsers(): Promise<void> {
		await this.usersRepository.delete({});
		await this.createSuperUser();
	}

	async updateUserPassword(id: number): Promise<string> {
		const password = generatePassword(16);

		await this.updateUser(id, {
			password,
		});

		return password;
	}
}
