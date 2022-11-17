import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'lesson-time' })
export class LessonTime {
	@PrimaryColumn()
	id: number;

	@Column()
	timeStart: string;

	@Column()
	timeEnd: string;
}
