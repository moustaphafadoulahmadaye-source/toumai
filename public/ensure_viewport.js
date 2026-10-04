const fs = require('fs');
const files = ['login.html', 'register.html', 'compte.html', 'panier.html', 'contact.html', 'collections.html', 'produits.html', 'index.html'];
files.forEach(f => {
  let c = fs.readFileSync(f, 'utf8');
  let changed = false;
  if (!c.includes('viewport')) {
    c = c.replace('<head>', '<head>\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">');
    changed = true;
  }
  if (changed) { fs.writeFileSync(f, c); console.log('Fixed ' + f); }
  else console.log('OK ' + f);
});
