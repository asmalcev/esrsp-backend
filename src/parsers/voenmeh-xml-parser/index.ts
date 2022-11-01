import * as fs from 'fs';
import * as path from 'path';
import { parse } from './parser';

const readFile = (pathToFile: string): string =>
	fs.readFileSync(path.join(__dirname, pathToFile), {
		encoding: 'utf-8',
	});

const writeFile = (pathToFile: string, data: string): void =>
	fs.writeFileSync(path.join(__dirname, pathToFile), data);

const dirPath = '../../../timetable/';

const parseResult = parse(readFile(dirPath + 'voenmeh.timetable.xml'));
writeFile(dirPath + 'voenmeh.timetable.json', JSON.stringify(parseResult));

// const parseResult = parse(readFile('tests/multi-teacher.xml'));
// console.log('\n\n', parseResult.lessons);
