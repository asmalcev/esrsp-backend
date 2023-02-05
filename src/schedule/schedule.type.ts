import { Lesson } from './entity/lesson';
import { LessonTime } from './entity/lesson-time';

export type TeacherStudentGroups = {
	discipline: string;
	disciplineId: number;
	studentGroup: string;
	studentGroupId: number;
};

export type TimedLessons = (Lesson & { lessonTime?: LessonTime })[];
