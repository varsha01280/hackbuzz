// test-serial.js
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

const port = new SerialPort({
  path: 'COM9',    // your Arduino COM port
  baudRate: 9600
});

const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

parser.on('data', (line) => {
  console.log('Arduino:', line);
});

port.on('open', () => {
  console.log('✅ Serial port COM9 is open and listening...');
});

port.on('error', (err) => {
  console.error('Serial port error:', err.message);
});