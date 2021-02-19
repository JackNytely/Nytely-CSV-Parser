//Internal - Constants
const { EventEmitter } = require('events')
const fs = require('fs')
const path = require('path')
const ErrorHandler = require('./errHandler.js')



//Internal - Functions



//---------------------------------\\



//External - Constants
const ParseEvents = new EventEmitter();



//External - Functions
const Parse = (file, options) => {
    if (!file) return ErrorHandler.Error(418.1)
    if (!fs.existsSync(file)) return ErrorHandler.Error(418.2, file)
    if (path.extname(file.toLowerCase()) !== '.csv') return ErrorHandler.Error(418.3, file)

    require('./csv-parser.js')(ParseEvents, file, options)
}

Parse.pause = (file, options) => {
    ParseEvents.emit('parse-stream-pause')
}

Parse.resume = (file, options) => {
    ParseEvents.emit('parse-stream-resume')
}



//---------------------------------\\



//EXPORTS
module.exports = { ParseEvents, Parse };