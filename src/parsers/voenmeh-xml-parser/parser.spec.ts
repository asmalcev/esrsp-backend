import * as fs from 'fs';
import * as path from 'path';
import { parse } from './parser';

const multiGroupAnswer = require('./tests/multi-group.json');
const emptyTeacherAnswer = require('./tests/empty-teacher.json');
const multiTeacherAnswer = require('./tests/multi-teacher.json');

const readFile = (pathToFile: string): string =>
	fs.readFileSync(path.join(__dirname, pathToFile), {
		encoding: 'utf-8',
	});

const TESTS = [
	{
		describe: 'multi-group',
		it: 'should return correct result with 2 groups',
		xmlFilePath: 'tests/multi-group.xml',
		anwser: JSON.stringify(multiGroupAnswer),
	},
	{
		describe: 'empty-teacher',
		it: 'should return correct result without any teachers',
		xmlFilePath: 'tests/empty-teacher.xml',
		anwser: JSON.stringify(emptyTeacherAnswer),
	},
	{
		describe: 'multi-teacher',
		it: 'should return correct result with 2 separate lessons',
		xmlFilePath: 'tests/multi-teacher.xml',
		anwser: JSON.stringify(multiTeacherAnswer),
	},
];

describe('Voenmeh Timetable Parser', () => {
	for (const test of TESTS) {
		describe(test.describe, () => {
			it(test.it, () => {
				const testXmlData = readFile(test.xmlFilePath);
				expect(JSON.stringify(parse(testXmlData))).toBe(test.anwser);
			});
		});
	}
});
