#!/usr/bin/env bash

firstTag=$(git tag --sort=-committerdate | head -1)
secondTag=$(git tag --sort=-committerdate | head -2 | tail -1)

git log --pretty=format:' — %s' ${secondTag}..${firstTag} > changelog.log

git log -1 --pretty=format:'%an <%ae>' > author.log

git log -1 --pretty=format:'%cd' > date.log