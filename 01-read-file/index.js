const fs = require('fs');
const path = require('path');
const dirPath = path.join(__dirname, 'text.txt');
const rr = fs.createReadStream(dirPath).setEncoding('utf8');

rr.on('data', (data) => {
  console.log(data);
});