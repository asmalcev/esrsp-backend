import { Parser } from '../parser-types';

const objectValuesCompare = (obj1, obj2, keys) => {
	for (const key of keys) {
		if (obj1[key] !== obj2[key]) return false;
	}
	return true;
};

export const uniqueLessonFilter = (lessons: Parser.Lesson[]) => {
	const uniqueLessons: Parser.Lesson[] = [];

	lessons.forEach((lesson) => {
		const alreadyInUnique = uniqueLessons.find((uniqueLesson) => {
			const sameOthers = objectValuesCompare(uniqueLesson, lesson, [
				'discipline',
				'lessonDay',
				'lessonNumber',
				'place',
			]);

			const sameTeacher =
				(!uniqueLesson.teacher && !lesson.teacher) ||
				uniqueLesson.teacher.id === lesson.teacher.id;

			return sameOthers && sameTeacher;
		});

		if (alreadyInUnique) {
			alreadyInUnique.groups.push(...lesson.groups);
		} else {
			uniqueLessons.push(lesson);
		}
	});

	return uniqueLessons;
};
