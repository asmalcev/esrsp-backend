import { Performance } from 'src/performance/entity/performance';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Lesson } from './lesson';

@Entity({ name: 'discipline' })
export class Discipline {
	@PrimaryGeneratedColumn('increment')
	id: number;

	@Column()
	name: string;

	@OneToMany(() => Lesson, (lesson) => lesson.discipline, {
		nullable: true,
		cascade: true,
	})
	lessons: Lesson[];

	@OneToMany(() => Performance, (performance) => performance.discipline, {
		nullable: true,
		cascade: true,
	})
	performances: Performance[];
}
