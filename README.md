## Express.js — GitHub Actions CI/CD

### How to trigger deploy action:

1. Make changes to the project
2. Commit changes:
```
git add .
git commit -m "<commit_message>"
```
3. Add tag to commit: `git tag <tag> <commit_hash>`
4. Push modification to `main` branch: `git push origin main --tags`
5. Commit with tag will trigger [GitHub Actions Deploy event](https://github.com/xaazias/express-ci-cd/actions)
