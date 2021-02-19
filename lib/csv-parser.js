//Modules
const fs = require('fs')
const {EventEmitter} = require('events')
const { Parse } = require('./app')

//Variables
let csvColumns = []
let csvArr = []
let csvEntries = []
let lastLine = ''
let currentChunk = 0
let isInProgress = "false"
let isPaused = 'false'
let entryCount = 0
let EOLDelimiter = '\n'
let chunkSize = '100'

//EXPORTS
module.exports = (ParseEvents, file, options) => {

	//Options Setup
	if (options.EOLDelimiter) EOLDelimiter = options.EOLDelimiter
	if (options.chunkSize) chunkSize = options.chunkSize

	//readStream Setup
	const readStream = fs.createReadStream(file, 'utf8')

	//ParseEvents Setup
	ParseEvents.on('parse-stream-pause', () => {
		ParseEvents.emit('pause')

		isPaused = 'true'
	})

	ParseEvents.on('parse-stream-resume', () => {
		ParseEvents.emit('resume')

		isPaused = 'false'
		readStream.resume()
	})

	readStream.on('ready', () => {
		ParseEvents.emit('ready')
	})

	//readStream ended function
	readStream.on('end', () => {
		inProgress()

		//In Progress Functions
		function inProgress() {
			setTimeout(() => {
				//Check if data is currently being written
				if (isInProgress == "true") {
					//If data is being written, retry the check
					inProgress()
					return
				} else {
					// Temporarily Store the Entries
					let writeArr = csvArr

					// Update the Entry Count
					if (entryCount < 1) entryCount = writeArr.length

					// Clear the memory
					csvEntries = []
					csvArr = []

					//return the entries
					if (writeArr.length > 0) {
						ParseEvents.emit('data', writeArr, entryCount)
					}

					//Reset Variables
					currentChunk = 0
					lastLine = ''
					entryCount = 0


					//Emit end of ReadStream
					ParseEvents.emit('end')
					return
				}
			}, 1000)
		}
	})

	readStream.on('data', (chunk) => {
		isInProgress = true

		//Pause the ReadStream to allow for parsing of received data
		readStream.pause()

		csvParserMain()


		function csvParserMain() {

			//Split Chunk into lines
			let csvLines = chunk.split(EOLDelimiter)

			//Parse
			if (csvColumns.length < 1) {

				//Find and Set the Columns
				csvColumns = csvLines.shift().split(',')

				//Replace any Symbols in the column names
				for (i = 0; i < csvColumns.length; i++) {
					csvColumns[i] = csvColumns[i].replace(' ', '_').replace(/[^a-zA-Z0-9 ]/g, "")
				}

				csvParserMain()

			} else {

				//Remove, Check and Repair the broken line
				lastLine = `${lastLine}${csvLines.shift().toString()}`

				//Re-add the repaired line 
				csvLines.unshift(lastLine)

				//Find and Set the entries on each line
				csvLines.forEach(line => {

					//Split lines into Entries
					let lineArr = line.split(',')

					//Save the entries
					csvEntries.push(lineArr)
				})


				//Find and Save the last entry to check for a broken line and entry
				lastLine = `${csvEntries[csvEntries.length - 1].toString()}`

				//Remove the broken entry from the entry list
				csvEntries.pop()

				let csvObj = []
				let csvObjIndex = 0

				//Find each value in an entry
				csvEntries.forEach(entry => {
					//Insert each value into its respective column
					for (let i = 0; i < entry.length; i++) {

						if (!csvObj[csvObjIndex]) csvObj[csvObjIndex] = []

						csvObj[csvObjIndex][csvColumns[i]] = entry[i]
					}

					csvObjIndex++

				})
				
				//Save the updated entries
				csvArr = csvObj

				//Check wether we have reached the desired chunk size
				if (currentChunk >= chunkSize) {

					//save the count of entries which exist for statistical purposes
					entryCount = Math.floor(entryCount + csvArr.length)

					// Temporarily Store Entries
					let writeArr = csvArr

					// Clear memory
					csvEntries = []
					csvArr = []

					//Return entries
					ParseEvents.emit('data', writeArr, entryCount)

					//Reset Variables
					entryCount = 0
					currentChunk = 0
					isInProgress = "false"

					//Resume the ReadStream
					if (isPaused == 'false') {
						setTimeout(() => {
							readStream.resume()
						}, 1000)
					}

					return
				} else {
					//Update the chunk progress
					currentChunk++
					isInProgress = "false"

					//Resume the ReadStream
						readStream.resume()

					return
				}
			}
		}


	})
};