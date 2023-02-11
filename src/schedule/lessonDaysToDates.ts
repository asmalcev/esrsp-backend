import { getBeginEndOfSemester, getddmm, isOddWeek } from 'src/utils';

export default (classdays: Array<number>): string[] => {
	const [BEGIN, END] = getBeginEndOfSemester();
	const _isOddWeek = isOddWeek(BEGIN);
	const currentDayInOrder = BEGIN.getDay() + (_isOddWeek ? 0 : 7);
	BEGIN.setDate(BEGIN.getDate() - currentDayInOrder + 1);

	const dates: string[] = [];

	let classdayIndex = 0;
	let lastClassday = 1;
	while (BEGIN < END) {
		if (lastClassday > classdays[classdayIndex]) {
			BEGIN.setDate(
				BEGIN.getDate() + (classdays[classdayIndex] - lastClassday + 14),
			);
		} else {
			BEGIN.setDate(
				BEGIN.getDate() + (classdays[classdayIndex] - lastClassday),
			);
		}
		dates.push(getddmm(BEGIN));
		lastClassday = classdays[classdayIndex];

		classdayIndex = (classdayIndex + 1) % classdays.length;
	}

	return dates.slice(1, -1); // first and last lessons are superfluous
};
