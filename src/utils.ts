/**
 * Author: Split Your Infinity
 * answered Jul 9, 2012 at 22:28
 * https://stackoverflow.com/questions/11404047/transliterating-cyrillic-to-latin-with-javascript-function
 */
export function transliterate(word: string): string {
	let answer = '';
	const a = {};

	a['Ё'] = 'YO';
	a['Й'] = 'I';
	a['Ц'] = 'TS';
	a['У'] = 'U';
	a['К'] = 'K';
	a['Е'] = 'E';
	a['Н'] = 'N';
	a['Г'] = 'G';
	a['Ш'] = 'SH';
	a['Щ'] = 'SCH';
	a['З'] = 'Z';
	a['Х'] = 'H';
	a['Ъ'] = "'";
	a['ё'] = 'yo';
	a['й'] = 'i';
	a['ц'] = 'ts';
	a['у'] = 'u';
	a['к'] = 'k';
	a['е'] = 'e';
	a['н'] = 'n';
	a['г'] = 'g';
	a['ш'] = 'sh';
	a['щ'] = 'sch';
	a['з'] = 'z';
	a['х'] = 'h';
	a['ъ'] = "'";
	a['Ф'] = 'F';
	a['Ы'] = 'I';
	a['В'] = 'V';
	a['А'] = 'А';
	a['П'] = 'P';
	a['Р'] = 'R';
	a['О'] = 'O';
	a['Л'] = 'L';
	a['Д'] = 'D';
	a['Ж'] = 'ZH';
	a['Э'] = 'E';
	a['ф'] = 'f';
	a['ы'] = 'i';
	a['в'] = 'v';
	a['а'] = 'a';
	a['п'] = 'p';
	a['р'] = 'r';
	a['о'] = 'o';
	a['л'] = 'l';
	a['д'] = 'd';
	a['ж'] = 'zh';
	a['э'] = 'e';
	a['Я'] = 'Ya';
	a['Ч'] = 'CH';
	a['С'] = 'S';
	a['М'] = 'M';
	a['И'] = 'I';
	a['Т'] = 'T';
	a['Ь'] = "'";
	a['Б'] = 'B';
	a['Ю'] = 'YU';
	a['я'] = 'ya';
	a['ч'] = 'ch';
	a['с'] = 's';
	a['м'] = 'm';
	a['и'] = 'i';
	a['т'] = 't';
	a['ь'] = "'";
	a['б'] = 'b';
	a['ю'] = 'yu';

	for (let i = 0; i < word.length; i++) {
		if (a[word[i]]) {
			answer += a[word[i]];
		} else {
			answer += word[i];
		}
	}

	return answer;
}

/**
 * Author: Gumbo
 * answered Sep 30, 2009 at 11:17
 * https://stackoverflow.com/questions/1497481/javascript-password-generator
 */
export function generatePassword(length: number): string {
	const charset =
		'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	let retVal = '';

	for (let i = 0, n = charset.length; i < length; ++i) {
		retVal += charset.charAt(Math.floor(Math.random() * n));
	}

	return retVal;
}
