const fs = require('fs');
const path = require('path');
const publicDir = path.join(process.cwd(), 'public');

const announcementHTML = `<div class="top-announcement" style="background-color: #F8E71C; border: 4px solid #D0021B; padding: 8px 16px; display: flex; align-items: center; justify-content: center; gap: 24px; margin: 0; flex-wrap: wrap; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
  <div style="display: flex; align-items: center; gap: 12px;">
    <span style="background-color: #222; color: #F8E71C; font-weight: 900; padding: 4px 10px; font-size: 1.2rem; letter-spacing: 1px; border-radius: 4px;">TEL</span>
    <span style="color: #D0021B; font-weight: 900; font-size: 1.6rem; letter-spacing: 1px;">66483146 - 99788569 - 66782203</span>
  </div>
  <div style="color: #222; font-weight: 800; font-size: 1.2rem; letter-spacing: 0.5px;">
    ABECHE - TACHAD
  </div>
</div>`;

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (content.includes('class="top-announcement"')) {
    return; // Already added
  }
  
  content = content.replace(/<body>/i, `<body>\n${announcementHTML}`);

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
console.log('Announcement bar added!');
