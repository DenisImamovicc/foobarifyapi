const express = require('express')
const app = express()
const cors = require('cors')
const multer = require('multer')
const fs = require('fs-extra')

const custom = require("./customFuncs.js")
const port = 4000
let SentFileContent

app.use(cors())

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'RecievedText/')
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  }
})
const upload = multer({ storage })

const readAndMoveFile = () => {
  const getRecievedFilename = fs.readdirSync('RecievedText', 'utf8', function (err, filename) {
    console.log('file: ' + filename)
    return filename
  })

  const getRecievedFileContent = fs.readFileSync(`RecievedText/${getRecievedFilename[0]}`, 'utf8', function (err, fileContent) {
    console.log('Dir empty :( ' + fileContent)
    return fileContent
  })
  fs.move(`RecievedText/${getRecievedFilename[0]}`, 'SentText/write.txt', { overwrite: true })

  return getRecievedFileContent
}

const deleteRecievedFileContent = () => {
  return fs.unlink(`RecievedText/${fs.readdirSync('RecievedText')}`)
}

const validateFile = (request, res) => {
  const allowedFileFormatRegex = /(\.txt|\.rtf|\.md|\.file)$/i

  if (allowedFileFormatRegex.test(request.file.originalname) && request.file.size > 0) {
    SentFileContent = readAndMoveFile()
  } else {
    deleteRecievedFileContent()
    throw new Error('Validate file func detected faulty file and removed it from senttext folder.')
  }
}

app.post('/file', upload.single('file'), function (req, res) {
  try {
    validateFile(req, res)
    return res.status(200).send({ text: 'Post req succesful,processing file now.' })
  } catch (error) {
    return res.status(400).send({ text: 'Illegitimate format!Please choose a non empty file with approved format.' })
  }
})

app.get('/modifedfile', function (req, res) {
  try {
    res.status(200).send({ text: custom.fooBarify(SentFileContent) })
  } catch (error) {
    res.status(400).send({ text: 'Illegitimate format!Stopping get req' })
  }
})

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`)
})

module.exports = { SentFileContent };