import { Performance } from 'src/performance/entity/performance';
import { StudentGroup } from 'src/schedule/entity/student-group';
import {
	Column,
	Entity,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'student' })
export class Student {
	@PrimaryGeneratedColumn('increment')
	id: number;

	@Column()
	fullname: string;

	@Column({ length: 16, unique: true })
	recordBook: string;

	@ManyToOne(() => StudentGroup, (studentGroup) => studentGroup.students, {
		nullable: true,
	})
	studentGroup: StudentGroup;

	@OneToMany(() => Performance, (performance) => performance.student, {
		nullable: true,
	})
	performance: Performance[];
}
