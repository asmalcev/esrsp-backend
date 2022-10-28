import { Performance } from "src/performance/entity/performance";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Lesson } from "./lesson";

@Entity({ name: 'discipline' })
export class Discipline {
	@PrimaryGeneratedColumn('increment')
	id: number;

	@Column()
	name: string;

	@OneToMany(() => Lesson, (lesson) => lesson.discipline)
	lessons: Lesson[];

	@OneToMany(() => Performance, (performance) => performance.discipline)
	performance: Performance[];
}