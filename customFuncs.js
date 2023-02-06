const inputFile = require('./server')

const fooBarify = function (inputFile) {
  const wordLibrary = {}
  const wholeWordRegex = /[A-Za-z]+/ig
  const matchFile = inputFile.match(wholeWordRegex)

  matchFile.forEach(word => {
    if (wordLibrary.hasOwnProperty(word)) {
      wordLibrary[word] = wordLibrary[word] + 1
    } else {
      Object.defineProperty(wordLibrary, word, {
        value: 1,
        writable: true,
        enumerable: true
      })
    }
  })

  const MostUsedWord=calcMostUsedWord(wordLibrary)
  const replaceTextRegex = new RegExp("\\b" + MostUsedWord + "\\b", 'gi')
  const fooBarifiedText = inputFile.replace(replaceTextRegex, `foo${MostUsedWord}bar`)

  return fooBarifiedText
}

const calcMostUsedWord = (wordLibrary)=>{
  return Object.keys(wordLibrary).reduce((a, b) => wordLibrary[b] > wordLibrary[a] ? b : a)
}

module.exports = { fooBarify,calcMostUsedWord }