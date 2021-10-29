#!/usr/bin/env bash

# echo $APP; echo $TAG; echo $PORT

docker build -t $APP:$TAG .

# docker run -d -p $PORT:8080 $APP:$TAG

echo Build $APP:$TAG completed.