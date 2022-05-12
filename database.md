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
	Id SERIAL,
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
	FOREIGN KEY (FlowId) REFERENCES Flow (Id) ON DELETE CASCADE,
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
	FOREIGN KEY (StudentId, DisciplineId) REFERENCES Student (Id), Discipline (Id) ON DELETE CASCADE
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
