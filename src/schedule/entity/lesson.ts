import { Teacher } from 'src/roles/entity/teacher';
import {
	Column,
	Entity,
	JoinTable,
	ManyToMany,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { Discipline } from './discipline';
import { StudentGroup } from './student-group';

@Entity({ name: 'lesson' })
export class Lesson {
	@PrimaryGeneratedColumn('increment')
	id: number;

	@ManyToMany(() => StudentGroup)
	@JoinTable()
	studentGroups: StudentGroup[];

	@ManyToOne(() => Teacher, (teacher) => teacher.lessons, {
		nullable: true,
		onDelete: 'CASCADE',
	})
	teacher: Teacher;

	@ManyToOne(() => Discipline, (discipline) => discipline.lessons, {
		onDelete: 'CASCADE',
	})
	discipline: Discipline;

	@Column()
	lessonNumber: number;

	@Column()
	lessonDay: number;

	@Column()
	place: string;
}
