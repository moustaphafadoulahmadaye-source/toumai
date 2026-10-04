const fs = require('fs');
const path = require('path');
const publicDir = path.join(process.cwd(), 'public');

const textLogoHTML = `<a href="index.html" class="logo" style="display: flex; flex-direction: column; line-height: 1.1; text-decoration: none;">
      <span style="font-size: 1.6rem; font-weight: 900; text-transform: uppercase; letter-spacing: -0.02em; color: #F8E71C; text-shadow: 0px 1px 4px rgba(0,0,0,0.2);">BOUTIQUE TOUMAÏ</span>
      <span style="font-size: 0.85rem; font-weight: 800; color: #D0021B; letter-spacing: 0.05em; text-transform: uppercase; font-family: 'Outfit', sans-serif;">ABNA HASSAN</span>
    </a>`;

const mobileTextLogoHTML = `<a href="index.html" class="mobile-menu-logo" style="display: flex; flex-direction: column; line-height: 1.1; text-decoration: none;">
      <span style="font-size: 1.3rem; font-weight: 900; text-transform: uppercase; letter-spacing: -0.02em; color: #F8E71C; text-shadow: 0px 1px 3px rgba(0,0,0,0.2);">BOUTIQUE TOUMAÏ</span>
      <span style="font-size: 0.75rem; font-weight: 800; color: #D0021B; letter-spacing: 0.05em; text-transform: uppercase;">ABNA HASSAN</span>
    </a>`;

const footerTextLogoHTML = `<div style="display: flex; flex-direction: column; line-height: 1.1; margin-bottom: 16px;">
      <span style="font-size: 1.8rem; font-weight: 900; text-transform: uppercase; letter-spacing: -0.02em; color: #F8E71C;">BOUTIQUE TOUMAÏ</span>
      <span style="font-size: 0.9rem; font-weight: 800; color: #D0021B; letter-spacing: 0.05em; text-transform: uppercase;">ABNA HASSAN</span>
    </div>`;

const authTextLogoHTML = `<a href="index.html" style="display: flex; flex-direction: column; align-items: center; line-height: 1.1; text-decoration: none; margin-bottom: 24px;">
      <span style="font-size: 2rem; font-weight: 900; text-transform: uppercase; letter-spacing: -0.02em; color: #F8E71C; text-shadow: 0px 1px 4px rgba(0,0,0,0.2);">BOUTIQUE TOUMAÏ</span>
      <span style="font-size: 1rem; font-weight: 800; color: #D0021B; letter-spacing: 0.05em; text-transform: uppercase;">ABNA HASSAN</span>
    </a>`;

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Header Logo
  content = content.replace(/<a href="index\.html" class="logo" style="text-decoration: none; display: flex; align-items: center;">[\s\S]*?<\/a>/g, textLogoHTML);
  
  // Mobile Logo
  content = content.replace(/<a href="index\.html" class="mobile-menu-logo" style="text-decoration: none; display: flex; align-items: center;">[\s\S]*?<\/a>/g, mobileTextLogoHTML);
  
  // Footer Logo
  content = content.replace(/<div style="margin-bottom: 24px;">[\s\S]*?<\/div>/g, footerTextLogoHTML);
  
  // Auth Logo
  content = content.replace(/<a href="index\.html" style="text-decoration: none; display: flex; justify-content: center; margin-bottom: 24px;">[\s\S]*?<\/a>/g, authTextLogoHTML);

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
console.log('Reverted to text logo!');
