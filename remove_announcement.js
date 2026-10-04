const fs = require('fs');
const path = require('path');
const publicDir = path.join(process.cwd(), 'public');

function removeAnnouncement(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Regex to remove the entire top-announcement div
  const regex = /<div class="top-announcement"[^>]*>[\s\S]*?<\/div>\s*<\/div>/g;
  // Actually, the structure I added was:
  // <div class="top-announcement" ...>
  //   <div>...</div>
  //   <div>...</div>
  // </div>
  // So it ends with </div>.
  // Since it was added right after <body>\n, let's just do:
  content = content.replace(/<div class="top-announcement"[\s\S]*?<\/div>\s*<\/div>/, '');

  fs.writeFileSync(filePath, content, 'utf8');
}

function processDir(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (file.endsWith('.html')) {
      removeAnnouncement(fullPath);
    }
  });
}

processDir(publicDir);
console.log('Removed announcement bar from all pages.');
