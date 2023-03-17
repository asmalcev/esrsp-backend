# ESRSP BACKEND
Серверная часть приложения электронного журнала.

## Содержание
- [ESRSP BACKEND](#esrsp-backend)
  - [Содержание](#содержание)
  - [Использование](#использование)
  - [Как разрабатывать локально](#как-разрабатывать-локально)
  - [Стек](#стек)
  - [Что умеет](#что-умеет)
    - [Аутентификация](#аутентификация)
    - [Роли](#роли)
      - [Студент](#студент)
      - [Преподаватель](#преподаватель)
    - [Расписание](#расписание)
      - [Группа студентов](#группа-студентов)
      - [Дисциплина](#дисциплина)
      - [Урок](#урок)
      - [Время урока](#время-урока)
      - [Расписание](#расписание-1)
      - [Список группы с успеваемостью](#список-группы-с-успеваемостью)
    - [Успеваемость](#успеваемость)
    - [Пользователи](#пользователи)
    - [Загрузка](#загрузка)
    - [Генерация аккаунтов пользователей](#генерация-аккаунтов-пользователей)

## Использование
На сервере нужно разместить два файла: `docker-compose.yml` и `.env`

`docker-compose.yml`:
```yaml
version: '3.6'

services:
  postgres:
    image: postgres:15.0
    restart: always
    environment:
      - POSTGRES_USER=${POSTGRES_USERNAME}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
      - POSTGRES_DB=${POSTGRES_DATABASE}
    volumes:
      - pgdata_local:/var/lib/postgresql/data
    ports:
      - ${POSTGRES_PORT}:${POSTGRES_PORT}

  redis:
    image: docker.io/bitnami/redis:7.0
    restart: always
    environment:
      - ALLOW_EMPTY_PASSWORD=yes
      - REDIS_DISABLE_COMMANDS=FLUSHDB,FLUSHALL
    ports:
      - ${REDIS_PORT}:${REDIS_PORT}
    volumes:
      - redis_data_local:/bitnami/redis/data

  backend:
    image: qzerrty/esrsp-backend:version
    restart: always
    ports:
      - ${PORT}:${PORT}
    env_file:
      - .env
    depends_on:
      - postgres
      - redis

  frontend:
    image: qzerrty/esrsp-gui:version
    restart: always
    ports:
      - ${CLIENT_PORT}:${CLIENT_PORT}
    environment:
      - SERVER_PORT=${PORT}
    depends_on:
      - backend


volumes:
  pgdata_local:

  redis_data_local:
    driver: local
```
Нужно не забыть указать версии образов qzerrty/esrsp-backend и qzerrty/esrsp-gui

Заполнить все поля в `.env`:
```
POSTGRES_USERNAME=
POSTGRES_PASSWORD=
POSTGRES_DATABASE=
POSTGRES_PORT=

REDIS_PORT=

SESSION_SECRET=
SUPERUSER_USERNAME=
SUPERUSER_PASSWORD=

PORT=
CLIENT_PORT=

LOGS_PATH=./logs
```

## Как разрабатывать локально
```bash
npm install --global yarn # если yarn не установлен

yarn initial
```
Создать `.env` на основе [`.env-example`](./.env-example), заполнив все пустые поля
```bash
yarn start:db # поднимет БД в докере в фоне
yarn start:dev

# можно начинать разработку
```

## Стек
- Nest
- TS
- TypeOrm
- PostgreSQL
- Docker
- Redis


## Что умеет


### Аутентификация
POST: `auth/login`
- войти в аккаунт
- необходимо передать логин и пароль от аккаунта
- создаст сессию

POST: `auth/logout`
- удаляет сессию

GET: `auth`
- проверить наличие сессии

### Роли


#### Студент
GET: `roles/student/:id`
- получить студента по id

GET: `roles/student`
- получить всех студентов

POST: `roles/student`
- создать нового студента

PUT: `roles/student/:id`
- обновить данные студента по id

DELETE: `roles/student/:id`
- удалить студента по id


#### Преподаватель
GET: `roles/teacher/:id`
- получить преподавателя по id

GET: `roles/teacher`
- получить всех преподавателей

POST: `roles/teacher`
- создать нового преподавателя

PUT: `roles/teacher/:id`
- обновить данные преподавателя по id

DELETE: `roles/teacher/:id`
- удалить преподавателя по id

### Расписание
#### Группа студентов
GET: `schedule/group/:id`
- получить группу студентов по id

GET: `schedule/group`
- получить все группы студентов

POST: `schedule/group`
- создать новую группу

PUT: `schedule/group/:id`
- обновить данные группы по id

DELETE: `schedule/group/:id`
- удалить группу по id


#### Дисциплина
GET: `schedule/discipline/:id`
- получить дисциплину по id

GET: `schedule/discipline`
- получить все дисциплины

POST: `schedule/discipline`
- создать новую дисциплину

PUT: `schedule/discipline/:id`
- обновить данные дисциплины по id

DELETE: `schedule/discipline/:id`
- удалить дисциплину по id


#### Урок
GET: `schedule/lesson/:id`
- получить урок по id

GET: `schedule/lesson`
- получить все уроки

POST: `schedule/lesson`
- создать новый урок

PUT: `schedule/lesson/:id`
- обновить данные урока по id

DELETE: `schedule/lesson/:id`
- удалить урок по id


#### Время урока
GET: `schedule/lesson-time/:id`
- получить время урок по id

GET: `schedule/lesson-time`
- получить все времена уроков

POST: `schedule/lesson-time`
- создать новое время урока

PUT: `schedule/lesson-time/:id`
- обновить данные времени урока по id

DELETE: `schedule/lesson-time/:id`
- удалить время урока по id


#### Расписание
GET: `schedule/teacher/:id`
- получить расписание преподавателя по id

GET: `schedule/student/:id`
- получить расписание студента по id

GET: `schedule`
- получить свое расписание (для авторизованных пользователей с типом роли: Студент, Преподаватель)

GET: `schedule/teacher/:id/groups`
- получить список групп преподавателя

GET: `schedule/student/:id/disciplines`
- получить список дисциплин студента

#### Список группы с успеваемостью
GET: `schedule/performance/:studentGroupId/:disciplineId`
- получить:
  - группу
  - дисциплину
  - список группы, совмещенный с датами занятий по дисциплине в виде таблицы


### Успеваемость
GET: `performance/:id`
- получить успеваемость по id

GET: `performance`
- получить всю успеваемость

POST: `performance`
- создать новую успеваемость

PUT: `performance/:id`
- обновить данные успеваемости по id

DELETE: `performance/:id`
- удалить успеваемость по id


### Пользователи
POST: `users/signup`
- зарегистрировать нового пользователя

PUT: `users/:id`
- обновить данные пользователя

DELETE: `users/:id`
- удалить пользователя


### Загрузка
POST: `upload/timetable/voenmeh/xml`
- загрузить расписание в формате XML по схеме ВОЕНМЕХа

POST: `upload/timetable/json`
- загрузить расписание в формате JSON по стандартной схеме

POST: `upload/timetable/lessons-times`
- загрузить промежутки уроков (в формате JSON по стандартной схеме)

POST: `upload/groups/json`
- загрузить список групп в формате JSON по стандартной схеме

### Генерация аккаунтов пользователей
GET: `generate/users`
- удалить всех имеющихся пользователей и создать аккаунты для всех студентов и преподавателей
