export namespace Parser {
	export type Teacher = {
		name?: string;
		id?: number;
	};

	export type Lesson = {
		discipline: string;
		teacher: Teacher;
		groups: string[];
		lessonNumber: number;
		lessonDay: number;
		place: string;
	};

	export type Result<T1, T2> = {
		lessons: Lesson[];
		groups: T1;
		teachers: T2;
		disciplines: T1;
	};
}