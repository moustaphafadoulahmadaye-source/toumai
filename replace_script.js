const fs = require('fs');
const path = require('path');
const publicDir = path.join(process.cwd(), 'public');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  content = content.replace(/Kolo<span style="font-weight: 300;">Market<\/span>/g, 'BOUTIQUE <span style="font-weight: 300;">TOUMAÏ</span>');
  content = content.replace(/Kolo<span>Market<\/span>/g, 'BOUTIQUE <span>TOUMAÏ</span>');
  content = content.replace(/Kolo Market/g, 'Boutique Toumaï');
  content = content.replace(/KOLO MARKET/g, 'BOUTIQUE TOUMAÏ');
  content = content.replace(/Kolo<span>Manager<\/span>/g, 'TOUMAÏ <span>Manager</span>');
  
  fs.writeFileSync(filePath, content, 'utf8');
}

const files = fs.readdirSync(publicDir);
files.forEach(file => {
  if (file.endsWith('.html')) {
    replaceInFile(path.join(publicDir, file));
  }
});
console.log('Done!');
