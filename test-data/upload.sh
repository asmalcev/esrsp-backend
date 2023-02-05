#!/bin/bash

source ../.env

curl -X POST -F file=@test.timetable.json localhost:$PORT/upload/timetable/json && echo "done" &&
curl -X POST -F file=@test.groups.json localhost:$PORT/upload/groups/json && echo "done" &&
curl -X POST -F file=@test.lessons-times.json localhost:$PORT/upload/timetable/lessons-times && echo "done"
