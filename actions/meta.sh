#!/usr/bin/env bash

FIRST_TAG=$(git tag --sort=-committerdate | head -1)
SECOND_TAG=$(git tag --sort=-committerdate | head -2 | tail -1)

echo "GIT_TAG_NAME=$FIRST_TAG" >> $GITHUB_ENV

git log --pretty=format:' — %s (%h)' ${SECOND_TAG}..${FIRST_TAG} > changelog.log

git log -1 --pretty=format:'%an <%ae>' > author.log

git log -1 --pretty=format:'%cd' > date.log