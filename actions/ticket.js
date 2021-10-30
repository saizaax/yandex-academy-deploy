const { readFile } = require("fs/promises")
const axios = require("axios")
const path = require("path")

const getChangelog = async () => {
  return await readFile(path.resolve(__dirname, "..", "changelog.log"))
}

const getAuthor = async () => {
  return await readFile(path.resolve(__dirname, "..", "author.log"))
}

const getDate = async () => {
  return await readFile(path.resolve(__dirname, "..", "date.log"))
}

const getTests = async () => {
  return JSON.parse(await readFile(path.resolve(__dirname, "..", "tests.json")))
}

const searchIssue = async (summary) => {
  const data = JSON.stringify({
    filter: {
      summary: summary,
      queue: process.env.TRACKER_QUEUE
    }
  })

  const res = await axios({
    method: "post",
    url: "https://api.tracker.yandex.net/v2/issues/_search",
    headers: {
      Authorization: `OAuth ${process.env.TRACKER_TOKEN}`,
      "X-Org-ID": `${process.env.TRACKER_ORG}`,
      "Content-Type": "application/json"
    },
    data: data
  })

  return res.data
}

const createIssue = async (summary, description) => {
  const data = JSON.stringify({
    summary: summary,
    queue: process.env.TRACKER_QUEUE,
    description: description
  })

  const res = await axios({
    method: "post",
    url: "https://api.tracker.yandex.net/v2/issues/",
    headers: {
      Authorization: `OAuth ${process.env.TRACKER_TOKEN}`,
      "X-Org-ID": `${process.env.TRACKER_ORG}`,
      "Content-Type": "application/json"
    },
    data: data
  })

  return res.data
}

const updateIssue = async (id, summary, description) => {
  const data = JSON.stringify({
    summary: summary,
    description: description
  })

  const res = await axios({
    method: "patch",
    url: `https://api.tracker.yandex.net/v2/issues/${id}`,
    headers: {
      Authorization: `OAuth ${process.env.TRACKER_TOKEN}`,
      "X-Org-ID": `${process.env.TRACKER_ORG}`,
      "Content-Type": "application/json"
    },
    data: data
  })

  return res.data
}

const postComment = async (id, text) => {
  const data = JSON.stringify({
    text: text
  })

  const res = await axios({
    method: "post",
    url: `https://api.tracker.yandex.net/v2/issues/${id}/comments`,
    headers: {
      Authorization: `OAuth ${process.env.TRACKER_TOKEN}`,
      "X-Org-ID": `${process.env.TRACKER_ORG}`,
      "Content-Type": "application/json"
    },
    data: data
  })

  return res.data
}

;(async () => {
  try {
    const author = (await getAuthor()).toString()
    const changelog = (await getChangelog()).toString()
    const date = (await getDate()).toString()
    const tests = (await getTests())?.testResults
      ?.map((test) =>
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

    let issueId
    const searchResults = await searchIssue(process.env.REPO)

    const summary = `Release (${process.env.REPO}) v${process.env.GIT_TAG_NAME}`
    const description = `Current version ${process.env.GIT_TAG_NAME} <${date}>`

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
