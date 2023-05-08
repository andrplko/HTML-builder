const fs = require('fs');
const path = require('path');
const { mkdir } = require('fs/promises');
const { readdir } = require('fs/promises');
const { copyFile } = require('fs/promises');
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
    const templateReadStream = fs.createReadStream(path.join(templatePathFile)).setEncoding('utf8');
    templateReadStream.on('data', data => {
      replacedFile = data;
    })
    let components = await readdir(componentsPathDir, { withFileTypes: true });
    for (let component of components) {
      let componentName = path.basename(path.join(__dirname, component.name), '.html');
      let componentReadStream = fs.createReadStream(path.join(componentsPathDir, component.name)).setEncoding('utf8');
      componentReadStream.on('data', data => {
        replacedFile = replacedFile.replace(new RegExp(`{{${componentName}}}`), data);
        fs.createWriteStream(path.join(__dirname, 'project-dist', 'index.html')).write(replacedFile + '\n');
      })
    }
    console.log('HTML file successfully created!');
  } catch (err) {
    console.error(err);
  }
};
createMarkupFile();
