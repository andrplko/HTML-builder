const path = require('path');
const { mkdir } = require('fs/promises');
const { readdir } = require('fs/promises');
const { copyFile } = require('fs/promises');
const { rm } = require('fs/promises');

async function createFolder() {
  try {
    const sourcePathDir = path.join(__dirname, 'files');
    const targetPathDir = path.join(__dirname, 'files-copy');
    await rm(targetPathDir, { recursive: true, force: true });
    await mkdir(targetPathDir, { recursive: true });
    console.log('Directory successfully created!');
    await copyFiles(sourcePathDir, targetPathDir);
  } catch (err) {
    console.error(err.message);
  }
}

async function copyFiles(source, target) {
  try {
    const files = await readdir(source, { withFileTypes: true });
    for (const file of files) {
      const sourcePath = path.join(source, file.name);
      const targetPath = path.join(target, file.name);
      await copyFile(sourcePath, targetPath);
      console.log(path.basename(targetPath));
    }
    console.log('Files successfully copied!');
  } catch (err) {
    console.error(err);
  }
}
console.log(createFolder());
