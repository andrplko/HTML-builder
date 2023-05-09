const fs = require('fs');
const path = require('path');
const { mkdir } = require('fs/promises');
const { readdir } = require('fs/promises');
const { copyFile } = require('fs/promises');
const { readFile } = require('fs/promises');
const { writeFile } = require('fs/promises');
const stylesPathDir = path.join(__dirname, 'styles');
const assetsPathDir = path.join(__dirname, 'assets');
const componentsPathDir = path.join(__dirname, 'components');
const targetPathDir = path.join(__dirname, 'project-dist/assets');
const templatePathFile = path.join(__dirname, 'template.html');

async function createFolder() {
  try {
    await mkdir(path.join(__dirname, 'project-dist'), { recursive: true });
    console.log('Directory successfully created!');
  } catch (err) {
    console.error(err.message);
  }
};
createFolder();

async function copyFiles(source, target) {
  try {
    const files = await readdir(source, { withFileTypes: true });
    for (const file of files) {
      if(file.isDirectory()) {
        await mkdir(path.join(target, file.name), { recursive: true });
        const sourcePath = path.join(source, file.name);
        const targetPath = path.join(target, file.name);
        await copyFiles(sourcePath, targetPath);
        console.log('Directory successfully copied!');
      } else {
        await copyFile(path.join(source, file.name), path.join(target, file.name));
      }
    }
  } catch (err) {
    console.error(err);
  }
};
copyFiles(assetsPathDir, targetPathDir);

async function mergeStyles() {
  try {
    const output = fs.createWriteStream(path.join(__dirname, 'project-dist', 'style.css'));
    const files = await readdir(stylesPathDir, { withFileTypes: true });
    for (let file of files) {
      if(file.isFile() && path.extname(path.join(stylesPathDir, file.name)) === '.css') {
        const input = fs.createReadStream(path.join(stylesPathDir, file.name)).setEncoding('utf8');
        input.on('data', data => {
          output.write(data.toString() + '\n');
        })
      }
    }
    console.log('Bundle successfully created!');
  } catch (err) {
    console.error(err);
  }
};
mergeStyles();

async function createMarkupFile() {
  try {
    let replacedFile;
    const files = await readdir(componentsPathDir, { withFileTypes: true });
    const templateRead = await readFile(templatePathFile, 'utf-8');
    replacedFile = templateRead;

    for (let file of files) {
      let componentName = path.basename(path.join(__dirname, file.name), '.html');
      let componentRead = await readFile(path.join(componentsPathDir, file.name), 'utf-8');
      replacedFile = replacedFile.replace(new RegExp(`{{${componentName}}}`), componentRead);
      await writeFile(path.join(__dirname, 'project-dist', 'index.html'), replacedFile);
    }
    console.log('HTML file successfully created!');
  } catch (err) {
    console.error(err);
  }
};
createMarkupFile();