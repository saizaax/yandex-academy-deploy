const { readFile } = require("fs/promises")
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

;(async () => {
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

  const result = [
    `${process.env.REPO}\n`,
    `Release: ${process.env.GIT_TAG_NAME}``Release date: ${date}`,
    `Author: ${author}\n`,
    `Changelog:\n${changelog}\n`,
    `Tests:\n${tests}\n`,
    `Docker build: ${process.env.DOCKER_STATUS}`
  ]

  console.log(result.join("\n"))
})()
