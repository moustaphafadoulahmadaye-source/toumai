const fs = require('fs');
const files = ['index.html', 'produits.html', 'panier.html', 'contact.html', 'collections.html', 'compte.html', 'login.html', 'register.html'];
for (const file of files) {
  try {
    let content = fs.readFileSync(file, 'utf8');
    
    // Change header display grid to flex to fix mobile layout
    content = content.replace(/<header class="main-header" style="display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; padding: 16px 40px;/g, 
    '<header class="main-header" style="display: flex; align-items: center; justify-content: space-between; padding: 16px 20px;');
    
    // Add hamburger button to header-right if not present
    if (!content.includes('hamburger-btn')) {
      content = content.replace(/<a href="panier\.html" class="cart-btn"/g, 
      `<button class="hamburger-btn" onclick="document.getElementById('mobileMenu').classList.add('open')" aria-label="Menu" style="margin-left: 8px;">\n        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>\n      </button>\n      <a href="panier.html" class="cart-btn"`);
    }
    
    fs.writeFileSync(file, content);
    console.log('Fixed mobile header for ' + file);
  } catch (e) {
    console.log('Failed for ' + file + ': ' + e.message);
  }
}
