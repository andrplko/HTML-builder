const fs = require('fs');
const path = require('path');
const { readdir } = require('fs/promises');
const stylesPath = path.join(__dirname, 'styles');
const bundlePath = path.join(__dirname, 'project-dist', 'bundle.css');
const ws = fs.createWriteStream(bundlePath);

async function mergeStyles() {
  try {
    const files = await readdir(stylesPath, { withFileTypes: true });
    for (const file of files)
      if(file.isFile() && path.extname(path.join(stylesPath, file.name)) === '.css') {
        const input = fs.createReadStream(path.join(stylesPath, file.name)).setEncoding('utf8');
        input.on('data', (data) => {
          ws.write(data.toString() + '\n');
        })
      }
    console.log('Bundle successfully created!');
  } catch (err) {
    console.error(err);
  }
};
console.log(mergeStyles());
