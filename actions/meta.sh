#!/usr/bin/env bash

echo $(git log --pretty=format:'— %s <%cd>' `git tag --sort=-committerdate | head -1`...`git tag --sort=-committerdate | head -2 | awk '{split($0, tags, "\n")} END {print tags[1]}'`)

git log -1 --pretty=format:'%an <%ae>' > author.log

git log -1 --pretty=format:'%cd' > date.log