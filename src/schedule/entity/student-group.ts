import { Student } from 'src/roles/entity/student';
import {
	Column,
	Entity,
	JoinTable,
	ManyToMany,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { Lesson } from './lesson';

@Entity({ name: 'student-group' })
export class StudentGroup {
	@PrimaryGeneratedColumn('increment')
	id: number;

	@Column({ length: 16, unique: true })
	name: string;

	@OneToMany(() => Student, (student) => student.studentGroup, {
		nullable: true,
	})
	students: Student[];

	@ManyToMany(() => Lesson, { nullable: true })
	@JoinTable()
	lessons: Lesson[];
}
