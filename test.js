//I AM A TEST FILE. ^_^

const CSVParser = require('./lib')
let indexVal = 0

//Start Parsing CSV Data
CSVParser.Parse('./5000000 Sales Records.csv', {
	EOLDelimiter: '\r\n',
	chunkSize: 100
})

//readStream Started
CSVParser.ParseEvents.on('ready', () => {

})

//CSV Data Stream
CSVParser.ParseEvents.on('data', (data, count) => {

	//Save the Entry Count for statistical logging
	indexVal = Math.floor(indexVal + count)

	//Log the current parsed entries count.
	console.log(`[\u001b[34m${indexVal}\u001b[37m]Parsed Successfully`)
})

//CSV Parsing Finished
CSVParser.ParseEvents.on('end', async () => {
	setTimeout(() => {
		return console.log(`\n\n\u001b[34mParsed ${indexVal} CSV Entries\u001b[37m Successfully`)
	}, 5000);
})
