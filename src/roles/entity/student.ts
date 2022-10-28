import { Performance } from "src/performance/entity/performance";
import { StudentGroup } from "src/schedule/entity/student-group";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'student' })
export class Student {
	@PrimaryGeneratedColumn('increment')
	id: number;

	@Column()
	fullname: string;

	@Column({ length: 16, unique: true })
	recordBook: string;

	@ManyToOne(() => StudentGroup, (studentGroup) => studentGroup.students)
	studentGroup: StudentGroup;

	@OneToMany(() => Performance, (performance) => performance.student)
	performance: Performance[];
}