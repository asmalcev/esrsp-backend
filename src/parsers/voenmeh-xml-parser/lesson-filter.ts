import { Parser } from '../parser-types';

const objectValuesEquals = (obj1, obj2, keys) => {
	for (const key of keys) {
		if (obj1[key] !== obj2[key]) return false;
	}
	return true;
};

type StudentGroupSetLesson = Omit<Parser.Lesson, 'studentGroupNames'> & {
	studentGroupNames: Set<string>;
};

export const uniqueLessonFilter = (
	lessons: Parser.Lesson[],
): Parser.Lesson[] => {
	const uniqueLessons: StudentGroupSetLesson[] = [];

	for (const lesson of lessons) {
		const alreadyInUnique = uniqueLessons.find((uniqueLesson) =>
			objectValuesEquals(uniqueLesson, lesson, [
				'teacherId',
				'lessonDay',
				'lessonNumber',
				'disciplineName',
				'place',
			]),
		);

		if (alreadyInUnique) {
			alreadyInUnique.studentGroupNames.add(lesson.studentGroupNames[0]);
		} else {
			uniqueLessons.push({
				...lesson,
				studentGroupNames: new Set(lesson.studentGroupNames),
			});
		}
	}

	return uniqueLessons.map((lesson) => ({
		...lesson,
		studentGroupNames: Array.from(lesson.studentGroupNames),
	}));
};
