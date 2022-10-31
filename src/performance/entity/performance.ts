import { Student } from 'src/roles/entity/student';
import { Discipline } from 'src/schedule/entity/discipline';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'performance' })
export class Performance {
	@PrimaryGeneratedColumn('increment')
	id: number;

	@Column({ length: 64 })
	value: string;

	@Column()
	date: Date;

	@ManyToOne(() => Student, (student) => student.performance, {
		onDelete: 'CASCADE',
	})
	student: Student;

	@ManyToOne(() => Discipline, {
		onDelete: 'CASCADE',
	})
	discipline: Discipline;
}
