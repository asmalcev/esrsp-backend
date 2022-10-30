import { XMLParser } from 'fast-xml-parser';
import { ruWeekDays } from '../parser-days';
import { Parser } from '../parser-types';
import { getLessonNumber } from './lessons-time';

const parseLecturers = (
	acc: Parser.Result<Set<string>>,
	lecturer: any,
): string[] => {
	if (lecturer instanceof Array) {
		lecturer.forEach(
			teacher => acc.teachers.add( teacher['ShortName'] )
		);
		return lecturer.map(teacher => teacher['ShortName']);
	}

	acc.teachers.add(lecturer['ShortName']);
	return [lecturer['ShortName']];
}

const parseDay = (
	acc: Parser.Result<Set<string>>,
	day: any,
	groupName: string,
) => {
	if (!(day instanceof Array)) {
		day = [day];
	}

	for (const lesson of day) {
		const teachers: string[] = lesson['Lecturers'] ? parseLecturers(acc, lesson['Lecturers']['Lecturer']) : [''];
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
	acc: Parser.Result<Set<string>>,
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

	const result: Parser.Result<Set<string>> = {
		lessons: [],
		teachers: new Set(),
		groups: new Set(),
		disciplines: new Set(),
	};

	timetable.Group.forEach(group => parseGroup(result, group));


	return result;
}