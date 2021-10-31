const {
  getFileData,
  searchIssue,
  createIssue,
  updateIssue,
  postComment
} = require("./helpers")

;(async () => {
  try {
    const author = (await getFileData("author.log")).toString()
    const changelog = (await getFileData("changelog.log")).toString()
    const date = (await getFileData("date.log")).toString()
    
    const tests = JSON.parse(await getFileData("tests.json"))
      ?.testResults?.map((test) =>
        test?.assertionResults?.map(
          (result) => `${result?.status.toUpperCase()} — ${result?.fullName}`
        )
      )
      .flat()
      .join("\n")

    const data = [
      `Release: ${process.env.REPO}:${process.env.GIT_TAG_NAME}`,
      `Date: ${date}`,
      `Author: ${author}\n`,
      `Changelog:\n${changelog}\n`,
      `Tests:\n${tests}\n`,
      `Docker build: ${process.env.DOCKER_STATUS}`
    ]

    const result = data.join("\n")
    console.log(result)

    const summary = `Release (${process.env.REPO}) v${process.env.GIT_TAG_NAME}`
    const description = `Current version ${process.env.GIT_TAG_NAME} <${date}>`

    let issueId
    const searchResults = await searchIssue(summary)

    if (!searchResults.length) {
      const issue = await createIssue(summary, description)
      issueId = issue.id
    } else {
      const issue = searchResults[0]
      issueId = issue.id

      await updateIssue(issueId, summary, description)
    }

    await postComment(issueId, result)
  } catch (err) {
    console.log(err)
  }
})()
