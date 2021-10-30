#!/usr/bin/env bash

firstTag=$(git tag | sort -r | head -1)
secondTag=$(git tag | sort -r | head -2 | awk '{split($0, tags, "\n")} END {print tags[1]}')

git log --pretty=format:' — %s' ${secondTag}..${firstTag} > changelog.log

git log -1 --pretty=format:'%an <%ae>' > author.log

git log -1 --pretty=format:'%cd' > date.log