import { Lesson } from 'src/schedule/entity/lesson';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

@Entity({ name: 'teacher' })
export class Teacher {
	@PrimaryColumn()
	id: number;

	@Column()
	fullname: string;

	@OneToMany(() => Lesson, (lesson) => lesson.teacher, { nullable: true })
	lessons: Lesson[];
}
