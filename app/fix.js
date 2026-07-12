const fs = require('fs');
const path = require('path');

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  if (content.startsWith('"') && content.trim().endsWith('"')) {
    let newContent = content.trim();
    newContent = newContent.substring(1, newContent.length - 1);
    newContent = newContent.replace(/\\"/g, '"');
    fs.writeFileSync(filePath, newContent, 'utf-8');
    console.log('Fixed ' + filePath);
  }
}

function walk(dir) {
  let list = fs.readdirSync(dir);
  for (let file of list) {
    let fileLocation = path.join(dir, file);
    let stat = fs.statSync(fileLocation);
    if (stat && stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.git') walk(fileLocation);
    }
    else fixFile(fileLocation);
  }
}

walk('.');
