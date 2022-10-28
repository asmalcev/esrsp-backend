import { Performance } from './performance/entity/performance';
import { Student } from './roles/entity/student';
import { Teacher } from './roles/entity/teacher';
import { Discipline } from './schedule/entity/discipline';
import { Lesson } from './schedule/entity/lesson';
import { StudentGroup } from './schedule/entity/student-group';
import { User } from './users/entity/user';

export default [User, Student, Teacher, Discipline, StudentGroup, Lesson, Performance];
