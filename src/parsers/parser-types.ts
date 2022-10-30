export namespace Parser {
	export type Lesson = {
		discipline: string;
		teacher: string;
		groups: string[];
		lessonNumber: number;
		lessonDay: number;
		place: string;
	};

	export type Result<T> = {
		lessons: Lesson[];
		groups: T;
		teachers: T;
		disciplines: T;
	};
}