import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UserRole } from '../dto/user.dto';

@Entity({ name: 'user' })
export class User {
	@PrimaryGeneratedColumn('increment')
	id: number;

	@Column({ unique: true })
	username: string;

	@Column()
	password: string;

	@Column({
		type: 'enum',
		enum: UserRole,
		default: UserRole.NOTaUSER,
	})
	role: UserRole;

	@Column({ nullable: true })
	roleId: number;
}
