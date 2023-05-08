const fs = require('fs');
const path = require('path');
const readline = require("readline");
const { stdout, stdin } = require('process');

const dirPath = path.join(__dirname, 'text.txt');
const ws = fs.createWriteStream(dirPath);

const logOut = () => {
  process.stdout.write('Bye! See you next time.');
  rl.close();
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

rl.write('Hello! Please, write the text...\n');

rl.on("line", input => {
  if(input.toString().trim() === 'exit') {
    logOut();
  }
  ws.write(input + '\n');
})

rl.on('SIGINT', logOut);
