const fs = require('fs');
const path = require('path');
const { stat } = require('fs/promises');
const { readdir } = require('fs/promises');
const dirPath = path.join(__dirname, 'secret-folder');

async function getData() {
  try {
    const files = await readdir(dirPath, { withFileTypes: true });
    for (const file of files)
      if(!file.isDirectory()) {
        dispayData(file);
      }
  } catch (err) {
    console.error(err);
  }
};

async function dispayData(item) {
  const filePath = path.join(__dirname, 'secret-folder', item.name);
  const ext = path.extname(filePath);
  const fileName = path.basename(filePath, ext);
  try {
    const fileStats = await stat(filePath);
      console.log(`${fileName} - ${ext.replace(".", "")} - ` + `${(fileStats.size / 1024).toFixed(3)}kB`);
  } catch (err) {
    console.error(err);
  }
};

console.log(getData());

