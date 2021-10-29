#!/usr/bin/env bash

# echo $APP; echo $TAG; echo $PORT

docker build -t $APP:$GIT_TAG_NAME .

# docker run -d -p $PORT:8080 $APP:$TAG

echo Build $APP:$GIT_TAG_NAME completed.