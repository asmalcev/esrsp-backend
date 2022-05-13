# Создание

## Создание базы
```sql
CREATE DATABASE esrsp_db;
```

## Создание таблиц

### Преподаватель
```sql
CREATE TABLE Teacher
(
	Id SERIAL PRIMARY KEY,
	FullName CHAR(128) NOT NULL,
	Email CHAR(128) NOT NULL,
	IsAdmin BOOL DEFAULT false
);
```

### Дисциплина
```sql
CREATE TABLE Discipline
(
	Id SERIAL PRIMARY KEY,
	Name CHAR(128) UNIQUE
);
```

### Группа
```sql
CREATE TABLE StudentGroup
(
	Id SERIAL PRIMARY KEY,
	Name CHAR(16) UNIQUE
);
```

### Студент
```sql
CREATE TABLE Student
(
	Id SERIAL PRIMARY KEY,
	FullName CHAR(128) NOT NULL,
	RecordBook CHAR(16) UNIQUE,
	StudentGroupId INT,
	FOREIGN KEY (StudentGroupId) REFERENCES StudentGroup (Id) ON DELETE SET NULL
);
```

### Поток
```sql
CREATE TABLE Flow
(
	Id INT,
	StudentGroupId INT,
	PRIMARY KEY (Id, StudentGroupId),
	FOREIGN KEY (StudentGroupId) REFERENCES StudentGroup (Id) ON DELETE CASCADE
);
```

### Занятие
```sql
CREATE TABLE Class
(
	Id SERIAL PRIMARY KEY,
	FlowId INT NOT NULL,
	TeacherId INT NOT NULL,
	DisciplineId INT NOT NULL,
	ClassNumber SMALLINT NOT NULL,
	ClassDay SMALLINT NOT NULL,
	Place CHAR(16) NOT NULL,
	FOREIGN KEY (TeacherId) REFERENCES Teacher (Id) ON DELETE CASCADE,
	FOREIGN KEY (DisciplineId) REFERENCES Discipline (Id) ON DELETE CASCADE
);
```

### Успеваемость студента
```sql
CREATE TABLE AcademicPerformance
(
	Id SERIAL PRIMARY KEY,
	StudentId INT NOT NULL,
	DisciplineId INT NOT NULL,
	FOREIGN KEY (StudentId) REFERENCES Student (Id) ON DELETE CASCADE,
	FOREIGN KEY (DisciplineId) REFERENCES Discipline (Id) ON DELETE CASCADE
);
```

### Успеваемость в дату
```sql
CREATE TABLE AcademicPerformanceDate
(
	Id SERIAL PRIMARY KEY,
	AcademicPerformanceId INT NOT NULL,
	Date DATE NOT NULL,
	AcademicPerformance VARCHAR(64) NOT NULL,
	FOREIGN KEY (AcademicPerformanceId) REFERENCES AcademicPerformance (Id) ON DELETE CASCADE
);
```

# Запросы
Частые запросы:
- расписание на две недели
- список группы с успеваемостью ее студентов по конкретному предмету
- список групп преподавателя

Запросы средней редкости:
- добавление мероприятия
- добавление оценки

Редкие запросы:
- добавление списка групп и списков групп
- добавление расписания

## Добавление данных
Добавление преподавателя
```sql
INSERT Teacher(FullName, Email) VALUES ('Дмитриев А.П.', 'dmitriev_ap@voenmeh.ru');
```

Добавление преподавателя-представителя деканата
```sql
INSERT Teacher(FullName, Email, IsAdmin) VALUES ('Дмитриев А.П.', 'dmitriev_ap@voenmeh.ru', true);
```

Добавление дисциплины
```sql
INSERT Discipline(Name) VALUES ('пр МЕТ.КРОСС.ТРАНСЛ.');
```

Добавление группы
```sql
INSERT StudentGroup(Name) VALUES ('И595');
```

Добавление студента
```sql
INSERT Student(FullName, RecordBook, StudentGroupId) VALUES ('Иванов И.И.', 'И59501', 1);
```

Добавление потока
```sql
INSERT Flow(Id, StudentGroupId) VALUES (1, 1);
```

Добавление занятия
```sql
INSERT Class(FlowId, TeacherId, DisciplineId, ClassNumber, ClassDay, Place) VALUES (1, 1, 1, 1, 1, '218*');
```

Добавление успеваемости студента
```sql
INSERT AcademicPerformance(StudentId, DisciplineId) VALUES (1, 1);
```

Добавление успеваемости в дату
```sql
INSERT AcademicPerformanceDate(AcademicPerformanceId, Date, AcademicPerformance) VALUES (1, '2022-05-13', '5');
```


## Получение данных

## Обновление данных
