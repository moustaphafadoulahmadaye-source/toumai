const fs = require('fs');
const path = require('path');
const publicDir = path.join(process.cwd(), 'public');

const imgLogoHTML = `<a href="index.html" class="logo" style="text-decoration: none; display: flex; align-items: center;">
      <img src="images/logo.jpg" alt="Boutique Toumaï Logo" style="height: 70px; width: auto; object-fit: contain; border-radius: 50%; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
    </a>`;

const mobileImgLogoHTML = `<a href="index.html" class="mobile-menu-logo" style="text-decoration: none; display: flex; align-items: center;">
      <img src="images/logo.jpg" alt="Boutique Toumaï Logo" style="height: 50px; width: auto; object-fit: contain; border-radius: 50%;">
    </a>`;

const footerImgLogoHTML = `<div style="margin-bottom: 24px;">
      <img src="images/logo.jpg" alt="Boutique Toumaï Logo" style="height: 80px; width: auto; object-fit: contain; border-radius: 50%;">
    </div>`;

const authImgLogoHTML = `<a href="index.html" style="text-decoration: none; display: flex; justify-content: center; margin-bottom: 24px;">
      <img src="images/logo.jpg" alt="Boutique Toumaï Logo" style="height: 100px; width: auto; object-fit: contain; border-radius: 50%; box-shadow: 0 8px 16px rgba(0,0,0,0.1);">
    </a>`;

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Header Logo - matching the current text logo we injected previously
  content = content.replace(/<a href="index\.html" class="logo" style="display: flex; flex-direction: column; line-height: 1\.1; text-decoration: none;">[\s\S]*?<\/a>/g, imgLogoHTML);
  
  // Mobile Logo
  content = content.replace(/<a href="index\.html" class="mobile-menu-logo" style="display: flex; flex-direction: column; line-height: 1\.1; text-decoration: none;">[\s\S]*?<\/a>/g, mobileImgLogoHTML);
  
  // Footer Logo
  content = content.replace(/<div style="display: flex; flex-direction: column; line-height: 1\.1; margin-bottom: 16px;">[\s\S]*?<\/div>/g, footerImgLogoHTML);
  
  // Auth Logo
  content = content.replace(/<a href="index\.html" style="display: flex; flex-direction: column; align-items: center; line-height: 1\.1; text-decoration: none; margin-bottom: 24px;">[\s\S]*?<\/a>/g, authImgLogoHTML);

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
console.log('Image logo replacement complete!');
