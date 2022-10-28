import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDto } from './dto/user.dto';
import { User } from './entity/user';

const SelectFindOptions = {
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
		const user = await this.getUserByUsername(userDto.username);

		if (user) {
			throw new BadRequestException('selected username is already taken');
		}

		return this.usersRepository.save({ ...userDto });
	}

	async getUserById(id: number): Promise<User> {
		return this.usersRepository.findOne({
			where: { id },
			select: SelectFindOptions,
		});
	}

	async getUserByUsername(username: string): Promise<User> {
		return this.usersRepository.findOne({ where: { username } });
	}

	async getAllUsers(): Promise<User[]> {
		return this.usersRepository.find({ select: SelectFindOptions });
	}
}
