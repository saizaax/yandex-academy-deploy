const { readFile } = require("fs/promises")
const axios = require("axios")
const path = require("path")

const TRACKER_API = "https://api.tracker.yandex.net"

const TRACKER_HEADERS = {
  Authorization: `OAuth ${process.env.TRACKER_TOKEN}`,
  "X-Org-ID": `${process.env.TRACKER_ORG}`,
  "Content-Type": "application/json"
}

const getFileData = async (file) => {
  return await readFile(path.resolve(__dirname, "..", file))
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
    url: `${TRACKER_API}/v2/issues/_search`,
    headers: TRACKER_HEADERS,
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
    url: `${TRACKER_API}/v2/issues/`,
    headers: TRACKER_HEADERS,
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
    url: `${TRACKER_API}/v2/issues/${id}`,
    headers: TRACKER_HEADERS,
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
    url: `${TRACKER_API}/v2/issues/${id}/comments`,
    headers: TRACKER_HEADERS,
    data: data
  })

  return res.data
}

module.exports = {
  getFileData,
  searchIssue,
  createIssue,
  updateIssue,
  postComment
}
