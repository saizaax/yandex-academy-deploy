#!/usr/bin/env bash

if docker build -t $APP:$GIT_TAG_NAME . ; then
  export DOCKER_STATUS="Build $APP:$GIT_TAG_NAME completed."
else 
  export DOCKER_STATUS="Build was not completed due to an error."
fi