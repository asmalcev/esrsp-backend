import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDto } from './dto/user.dto';
import { User } from './entity/user';

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
	) {}

	async createUser(userDto: UserDto): Promise<User> {
		const user = await this.getUserByUsername(userDto.username, false);

		if (user) {
			throw new BadRequestException('selected username is already taken');
		}

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

	async getUserByUsername(
		username: string,
		throwErr: boolean = true
	): Promise<User> {
		const user = await this.usersRepository.findOne({ where: { username } });

		if (throwErr && !user) {
			throw new NotFoundException('user is not found');
		}

		return user;
	}

	async getAllUsers(): Promise<User[]> {
		return this.usersRepository.find({ select: SelectFindOptions });
	}

	async updateUser(id: number, userDto: Partial<UserDto>): Promise<void> {
		this.usersRepository.update({ id }, { ...userDto });
	}

	async removeUser(id: number): Promise<void> {
		this.usersRepository.delete({ id });
	}
}
