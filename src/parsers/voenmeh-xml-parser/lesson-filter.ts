import { Parser } from '../parser-types';

const objectValuesCompare = (obj1, obj2, keys) => {
	for (const key of keys) {
		if (obj1[key] !== obj2[key]) return false;
	}
	return true;
};

export const uniqueLessonFilter = (lessons: Parser.Lesson[]): Parser.Lesson[] => {
	const uniqueLessons: Parser.Lesson[] = [];

	lessons.forEach((lesson) => {
		const alreadyInUnique = uniqueLessons.find((uniqueLesson) => {
			const sameOthers = objectValuesCompare(uniqueLesson, lesson, [
				'disciplineName',
				'lessonDay',
				'lessonNumber',
				'place',
				'teacherId',
			]);

			return sameOthers;
		});

		if (alreadyInUnique) {
			alreadyInUnique.studentGroupNames.push(...lesson.studentGroupNames);
		} else {
			uniqueLessons.push(lesson);
		}
	});

	return uniqueLessons;
};
