export const lessonsTime = [
	'9:00',
	'10:50',
	'12:40',
	'14:55',
	'16:45',
	'18:30',
];

export const getLessonNumber = (lessonTime: string): number => {
	for (let i = 0; i < lessonsTime.length; i++) {
		if (lessonTime.includes(lessonsTime[i])) return i + 1;
	}
	return 100;
};
