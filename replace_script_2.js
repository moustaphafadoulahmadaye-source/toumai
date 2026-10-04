const fs = require('fs');
const path = require('path');
const publicDir = path.join(process.cwd(), 'public');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  content = content.replace(/Kolo<span style="color: #ff6b6b;">Market<\/span>/g, 'BOUTIQUE <span style="color: #ff6b6b;">TOUMAÏ</span>');
  content = content.replace(/Kolo<span style="color: var\(--coral, #ff6b6b\);">Market<\/span>/g, 'BOUTIQUE <span style="color: var(--coral, #ff6b6b);">TOUMAÏ</span>');
  content = content.replace(/Kolo<span style="color: var\(--coral\);">Market<\/span>/g, 'BOUTIQUE <span style="color: var(--coral);">TOUMAÏ</span>');
  content = content.replace(/Kolo Tech/g, 'Boutique Toumaï Tech');
  content = content.replace(/Kolo Wear/g, 'Boutique Toumaï Wear');
  content = content.replace(/contact@kolomarket\.com/g, 'contact@boutiquetoumai.com');
  content = content.replace(/Kolo Market/g, 'Boutique Toumaï');
  
  fs.writeFileSync(filePath, content, 'utf8');
}

function processDir(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (file.endsWith('.html') || file.endsWith('.js')) {
      replaceInFile(fullPath);
    }
  });
}

processDir(publicDir);
console.log('Done additional replacements!');
