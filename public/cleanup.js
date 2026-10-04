const fs = require('fs');
const files = ['index.html', 'produits.html', 'panier.html', 'contact.html', 'collections.html', 'compte.html', 'login.html', 'register.html'];
for (const file of files) {
  try {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/data-i18n="([^"]+)"\s*data-i18n="\1"/g, 'data-i18n="$1"');
    fs.writeFileSync(file, content);
  } catch (e) {}
}
