const fs = require('fs');
const path = require('path');
const publicDir = path.join(process.cwd(), 'public');

const imgLogoHTML = `<a href="index.html" class="logo" style="text-decoration: none; display: flex; align-items: center;">
      <img src="images/logo.jpg" alt="Boutique Toumaï Logo" style="height: 70px; width: auto; object-fit: contain;">
    </a>`;

const mobileImgLogoHTML = `<a href="index.html" class="mobile-menu-logo" style="text-decoration: none; display: flex; align-items: center;">
      <img src="images/logo.jpg" alt="Boutique Toumaï Logo" style="height: 50px; width: auto; object-fit: contain;">
    </a>`;

const footerImgLogoHTML = `<div style="margin-bottom: 24px;">
      <img src="images/logo.jpg" alt="Boutique Toumaï Logo" style="height: 80px; width: auto; object-fit: contain;">
    </div>`;

const authImgLogoHTML = `<a href="index.html" style="text-decoration: none; display: flex; justify-content: center; margin-bottom: 24px;">
      <img src="images/logo.jpg" alt="Boutique Toumaï Logo" style="height: 100px; width: auto; object-fit: contain;">
    </a>`;

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Update Header Logo
  content = content.replace(/<a href="index\.html" class="logo" style="text-decoration: none; display: flex; align-items: center;">[\s\S]*?<\/a>/g, imgLogoHTML);
  
  // Update Mobile Logo
  content = content.replace(/<a href="index\.html" class="mobile-menu-logo" style="text-decoration: none; display: flex; align-items: center;">[\s\S]*?<\/a>/g, mobileImgLogoHTML);
  
  // Update Footer Logo
  content = content.replace(/<div style="margin-bottom: 24px;">[\s\S]*?<\/div>/g, footerImgLogoHTML);
  
  // Update Auth Logo
  content = content.replace(/<a href="index\.html" style="text-decoration: none; display: flex; justify-content: center; margin-bottom: 24px;">[\s\S]*?<\/a>/g, authImgLogoHTML);

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
console.log('Logo styling fixed to show full image!');
