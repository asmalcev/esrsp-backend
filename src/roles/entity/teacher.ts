import { Lesson } from "src/schedule/entity/lesson";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'teacher' })
export class Teacher {
	@PrimaryGeneratedColumn('increment')
	id: number;

	@Column()
	fullname: string;

	@OneToMany(() => Lesson, (lesson) => lesson.teacher)
	lessons: Lesson[];
}