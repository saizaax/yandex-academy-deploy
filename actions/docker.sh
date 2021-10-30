#!/usr/bin/env bash

if docker build -t $APP:$GIT_TAG_NAME . ; then
  echo Build $APP:$GIT_TAG_NAME completed.
else 
  echo Build was not completed due to an error.
fi