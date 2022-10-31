import { XMLParser } from 'fast-xml-parser';
import { WithId } from 'src/common-types';
import { IdSet } from '../id-set';
import { ruWeekDays } from '../parser-days';
import { Parser } from '../parser-types';
import { getLessonNumber } from './lessons-time';

const parseLecturers = (
	acc: Parser.Result<Set<string>, IdSet>,
	lecturer: any,
): Parser.Teacher[] => {
	if (lecturer instanceof Array) {
		lecturer.forEach(
			teacher => acc.teachers.add({
				id: teacher['IdLecturer'],
				name: teacher['ShortName'],
			} as WithId)
		);
		return lecturer.map(teacher => ({
			id: teacher['IdLecturer'] as number,
			name: teacher['ShortName'] as string,
		}));
	}

	acc.teachers.add({
		id: lecturer['IdLecturer'],
		name: lecturer['ShortName'],
	} as WithId);
	return [lecturer['ShortName']];
}

const parseDay = (
	acc: Parser.Result<Set<string>, IdSet>,
	day: any,
	groupName: string,
) => {
	if (!(day instanceof Array)) {
		day = [day];
	}

	for (const lesson of day) {
		const teachers: Parser.Teacher[] = lesson['Lecturers'] ? parseLecturers(acc, lesson['Lecturers']['Lecturer']) : [{}];
		const discipline: string = lesson['Discipline'];
		const place: string = lesson['Classroom'];
		const groups: string[] = [groupName];
		const lessonNumber: number = getLessonNumber(lesson['Time']);

		// lessonDay =
		//   day number of the week +
		//   7 if it's even week, else 0 +
		//   1 because need number not index
		const lessonDay: number = ruWeekDays.indexOf(lesson['DayTitle']) + lesson['WeekCode'] * 7 - 6;

		acc.disciplines.add(discipline);

		acc.lessons.push(
			...teachers.map(
				teacher => ({
					teacher,
					discipline,
					place,
					groups,
					lessonNumber,
					lessonDay
				})
			)
		);
	}
}

const parseGroup = (
	acc: Parser.Result<Set<string>, IdSet>,
	group: any
) => {
	const groupName: string = group['@_Number'];
	acc.groups.add(groupName);

	if (!group['Days']) return;

	let days = group['Days']['Day'];

	if (!(days instanceof Array)) {
		days = [days];
	}

	days.forEach(day =>
		parseDay(acc, day['GroupLessons']['Lesson'], groupName)
	);
}

export const parse = (xmlInput: string) => {
	const options = {
		ignoreAttributes: false,
	};
	const parser = new XMLParser(options);
	const timetable = parser.parse(xmlInput).Timetable;

	const acc: Parser.Result<Set<string>, IdSet> = {
		lessons: [],
		teachers: new IdSet(),
		groups: new Set(),
		disciplines: new Set(),
	};

	timetable.Group.forEach(group => parseGroup(acc, group));

	const result: Parser.Result<string[], Parser.Teacher[]> = {
		lessons: acc.lessons,
		teachers: acc.teachers.toArray(),
		groups: Array.from(acc.groups),
		disciplines: Array.from(acc.disciplines),
	};

	return result;
}