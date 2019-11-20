const fs = require('fs')
const readline = require('readline')

const argv = process.argv.slice(2)

const [filePath, maxOutputNumber] = argv

const readInterface = readline.createInterface({
    input: fs.createReadStream(filePath),
    // output: process.stdout,
    console: false
})

const scores = []

readInterface.on('line', (line) => {
  // console.log(line)
  const matchParts = line.match(/([0-9]*): (.*)/)

  if (!matchParts) {
    // The `id` must be at the root level of the JSON object, if it is not present it is a format error
    console.error('format error')
    process.exit(1)
  }

  const [original, score, jsonString] = matchParts

  try {
    const jsonParsed = JSON.parse(jsonString)

    scores.push({
      score: Number(score),
      id: jsonParsed.id,
    })
  } catch (error) {
    // Note that one of the entries, for score `11025835`, has a document portion that is _not_ JSON. If this line was included in the result set, then the program should error, but if not then it should continue.
    console.error('invalid json format No JSON object could be decoded')
    console.error('THIS IS NOT JSON')
    process.exit(1)
  }
})

readInterface.on('close', (line) => {
  const reverseSortedScores = scores.sort((a, b) => {
    if (a.score < b.score) {
      return 1
    }

    if (a.score > b.score) {
      return -1
    }

    return 0
  })

  console.log(
    JSON.stringify(
      reverseSortedScores.slice(0, maxOutputNumber)
    )
  )

  process.exit(0)
})
