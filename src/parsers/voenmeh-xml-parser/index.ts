import * as fs from 'fs';
import * as path from 'path';
import { uniqueLessonFilter } from './lesson-filter';
import { parse } from './parser';

const readFile = (pathToFile: string): string =>
	fs.readFileSync(path.join(__dirname, pathToFile), {
		encoding: 'utf-8',
	});

const writeFile = (pathToFile: string, data: string): void =>
	fs.writeFileSync(path.join(__dirname, pathToFile), data);

const dirPath = '../../../timetable/';

const parseResult = parse(readFile(dirPath + 'voenmeh.timetable.xml'));

parseResult.lessons = uniqueLessonFilter(parseResult.lessons);

writeFile(dirPath + 'voenmeh.timetable.json', JSON.stringify(parseResult));
