## Nytely CSV Parser

This package allows the conversion from a CSV Format to a more friendly JS Array Format. <br/>

Unlike most CSV Parsers currently available, this Parser streams the Parsed data in Chunks,
this has the benefit of avoiding Memory Issues when trying to read Large CSV Files in JS, Furthermore, this also allows
the user to tweak the "Chunk Size" of the Parsed Data for the requirements of their project. <br/>

Parses approximately 10,000 entries per second. <br/>

[![NPM](https://nodei.co/npm/nytely-csv-parser.png?stars&downloads)](https://nodei.co/npm/nytely-csv-parser/) <br/>

## Usage

Installation Command: `npm install nytely-csv-parser`. <br/>

```js
const CSVParser = require('nytely-csv-parser');

//COMMANDS
CSVParser.Parse(file, {
	EOLDelimiter: '\n', // To specify the End of Line character in your chosen CSV File (NOT REQUIRED).
	chunkSize: 100 // To specify the size of the parsed data being sent (Approximately 500 CSV Entries per 1 Chunk).
)}

CSVParser.Parse.pause() // Pauses the Parsed Data Stream

CSVParser.Parse.resume() // Resumes the Parsed Data Stream


//EVENTS
CSVParser.ParseEvents.on('data', (data, count) => {
	// data: The parsed csv data being "Streamed".
	// count: The ammount of csv entries in the parsed csv data.
});

CSVParser.ParseEvents.on('pause', () => {
	//Does something once the Parsed Data Stream is Paused.
});

CSVParser.ParseEvents.on('resume', () => {
	//Does something once the Parsed Data Stream is Resumed.
});

CSVParser.ParseEvents.on('end', () => {
	//Does something once the Parsed Data Stream has Ended.
});
``` <br/>

## Example
```js
//test.csv:
	
a,b,c
1,3,1
4,3,6
3,1,1
"foo", "bar", "ten"
``` <br/>

```js
//example.js


//Import the CSVParser Module
const CSVParser = require('nytely-csv-parser');

//Define the CSV File
const file = './test.csv';

//Start Parsing the Specified Data
CSVParser.Parse(file, {
	EOLDelimiter: '\r\n',
	chunkSize: 100
});

//CSV Data Stream
CSVParser.ParseEvents.on('data', (data, count) => {

	//Pause the Parsed Data Stream
	CSVParser.Parse.pause()

	//Log the Data in the Console
	console.log(data)

	//Resume the Parsed Data Stream
	CSVParser.Parse.resume()
});
``` <br/>

```js
//CONSOLE OUTPUT:

[ [a: 1, b: 3, c: 1], [a: 4, b: 3, c: 6], [a: 3, b: 1, c: 1], [a: 'foo', b: 'bar', c: 'world'] ]
``` <br/>

## Feedback
Please feel free to join our Discord Server for Discussion on the Package. <br/>
Any bugs/issues can be reported on our Github. <br/>

Discord: https://discord.gg/kUBXjaM <br/>
Github: https://github.com/JackNytely/Nytely-CSV-Parser <br/>

## Thankyou
Thankyou for using our package, we are always here to be of assistance ^_^. <br/>