const fs = require('fs');
const path = require('path');
const publicDir = path.join(process.cwd(), 'public');

// Colors
const yellow = '#F8E71C';
const red = '#D0021B';

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // 1. Update contact info
  content = content.replace(/\+250 795 590 690/g, '66483146 - 99788569 - 66782203');
  content = content.replace(/au Kigali/g, 'à Abéché, Tchad');
  
  // 2. Change logo colors back to yellow and red as requested
  // Header
  content = content.replace(/color: #111;">BOUTIQUE TOUMAÏ/g, `color: ${yellow};">BOUTIQUE TOUMAÏ`);
  content = content.replace(/color: #FFF;">BOUTIQUE TOUMAÏ/g, `color: ${yellow};">BOUTIQUE TOUMAÏ`);

  fs.writeFileSync(filePath, content, 'utf8');
}

function processDir(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (file.endsWith('.html')) {
      replaceInFile(fullPath);
    }
  });
}

processDir(publicDir);
console.log('Footer updated!');
