import * as fs from 'fs';
import * as path from 'path';
import { parse } from './parser';

const readFile = (pathToFile: string): string => fs.readFileSync(
	path.join(__dirname, pathToFile),
	{
		encoding: 'utf-8',
	},
);

parse( readFile('../../../timetable/voenmeh.timetable.xml') );
