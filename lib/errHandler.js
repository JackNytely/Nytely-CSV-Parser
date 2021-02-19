//Internal - Constants
const { EventEmitter } = require('events')
const fs = require('fs')
const path = require('path')
const Colors = require('./Colors.js')

//Internal - Functions
const ParseErr = (errCode, data) => {

    if (errCode == 418.1) {
        return console.log(
            `[${Colors.Red}Nytely CSV Parser${Colors.White}] ${Colors.Yellow}No file has been specified${Colors.White}\n` +
            `${Colors.Yellow}Parse(${Colors.Red}File${Colors.Yellow})${Colors.White}\n`
        )
    }

    if (errCode == 418.2) {
        return console.log(
            `[${Colors.Red}Nytely CSV Parser${Colors.White}] ${Colors.Yellow} The specified file does not exist${Colors.White}\n` +
            `${Colors.Yellow}Specified File: "${Colors.Red}${data}${Colors.Yellow}"${Colors.White}\n`
        )
    }

    if (errCode == 418.3) {
        return console.log(
            `[${Colors.Red}Nytely CSV Parser${Colors.White}] ${Colors.Yellow} The specified file is not of type ${Colors.Green}CSV${Colors.White}\n` +
            `${Colors.Yellow}Specified File Type: "${Colors.Red}${path.extname(data)}${Colors.Yellow}"${Colors.White}\n`
        )
    }
}

//---------------------------------\\



//External - Constants




//External - Functions
const Error = (errCode, data) => {
    return ParseErr(errCode, data)
}



//---------------------------------\\



//EXPORTS
module.exports = { Error };