Teacher:
```sql
INSERT INTO Teacher(FullName, Email)
VALUES
('Потапов П.А.', 'potapov_pa@voenmeh.ru'),
('Фомин А.Р.', 'fomin_ar@voenmeh.ru'),
('Пестова А.Г.', 'pestova_ag@voenmeh.ru'),
('Мартынова Р.А.', 'martinova_ra@voenmeh.ru'),
('Мухина М.П.', 'muhina_mp@voenmeh.ru');
```

Teacher-admin:
```sql
INSERT INTO Teacher(FullName, Email, IsAdmin)
VALUES ('Дмитриев А.П.', 'dmitriev_ap@voenmeh.ru', true);
```

Discipline:
```sql
INSERT INTO Discipline(Name)
VALUES
('пр МЕТ.КРОСС.ТРАНСЛ.'),
('пр МАТ.СТАТИСТ.И СП'),
('пр РАЗР.И АН.ТРЕБ.'),
('лек МЕТ.КРОСС.ТРАНСЛ.'),
('лек МАТ.СТАТИСТ.И СП'),
('лек РАЗР.И АН.ТРЕБ.'),
('пр БАЗЫ ДАННЫХ'),
('лек БАЗЫ ДАННЫХ'),
('пр ПРЕДСТ.ЗНАН.В ИС'),
('лек ПРЕДСТ.ЗНАН.В ИС'),
('лаб БЖД'),
('лек БЖД');
```