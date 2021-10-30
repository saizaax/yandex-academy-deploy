#!/usr/bin/env bash

if docker build -t $APP:$GIT_TAG_NAME . ; then
  echo "DOCKER_STATUS='Build $APP:$GIT_TAG_NAME completed.'" >> $GITHUB_ENV
else 
  echo "DOCKER_STATUS='Build was not completed due to an error.'" >> $GITHUB_ENV
fi