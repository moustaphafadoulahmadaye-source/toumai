const fs = require('fs');

const path = 'public/admin.html';
let html = fs.readFileSync(path, 'utf8');

const newStyle = `<style>
  body { background: var(--bg); font-family: 'Inter', sans-serif; }
  header { border-bottom: 1px solid var(--line); padding: 20px 40px; display: flex; justify-content: space-between; align-items: center; }
  .logo { font-family: 'Outfit', sans-serif; font-size: 1.5rem; letter-spacing: -0.05em; font-weight: 800; text-transform: uppercase; text-decoration: none; color: var(--ink); }
  .logo span { font-weight: 300; margin-left: 8px; color: var(--text-secondary); }
  .header-right { display: flex; align-items: center; gap: 24px; }
  .cart-btn { background: transparent; border: 1px solid var(--ink); color: var(--ink); border-radius: 0; padding: 12px 24px; text-transform: uppercase; font-size: 0.8rem; font-weight: 700; letter-spacing: 0.1em; transition: background 0.3s, color 0.3s; cursor: pointer; }
  .cart-btn:hover { background: var(--ink); color: var(--paper); }
  
  .admin-grid { display: grid; grid-template-columns: 1fr; gap: 80px; max-width: 1600px; margin: 0 auto; padding: 80px 40px; align-items: start; }
  @media(min-width: 1024px) { .admin-grid { grid-template-columns: 400px 1fr; } }
  
  .admin-panel { background: transparent; border: none; padding: 0; box-shadow: none; margin-bottom: 80px; }
  .admin-panel h2 { margin-bottom: 40px; font-size: 1.25rem; font-family: 'Outfit', sans-serif; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--ink); border-bottom: 1px solid var(--line); padding-bottom: 24px; }
  
  .message-card { background: transparent; border: 1px solid var(--line); border-radius: 0; padding: 32px; margin-bottom: 24px; transition: border-color 0.3s; }
  .message-card:hover { border-color: var(--ink); }
  .message-card h4 { margin: 0 0 16px; color: var(--ink); font-size: 1.25rem; font-weight: 600; font-family: 'Outfit', sans-serif; }
  .message-card p { font-size: 0.95rem; color: var(--text-secondary); margin: 0 0 8px 0; line-height: 1.6; }
  
  input, select, textarea, .file-input { font-family: 'Inter', sans-serif; font-size: 0.95rem; padding: 20px; border: 1px solid var(--line); border-radius: 0; background: transparent; color: var(--ink); width: 100%; box-sizing: border-box; outline: none; transition: border-color 0.3s; margin-bottom: 24px; }
  input:focus, select:focus, textarea:focus { border-color: var(--ink); }
  
  .checkout-btn { width: 100%; background: var(--ink); color: var(--paper); border: none; padding: 24px; border-radius: 0; font-size: 0.95rem; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 700; cursor: pointer; transition: opacity 0.3s; }
  .checkout-btn:hover { opacity: 0.8; }
  
  .preview-img { width: 100%; height: 300px; object-fit: cover; display: none; margin-bottom: 24px; border: 1px solid var(--line); }
  
  .product-list { display: grid; gap: 32px; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); }
  .admin-product { background: transparent; border: 1px solid var(--line); padding: 24px; display: flex; flex-direction: column; gap: 16px; }
  .admin-product img { width: 100%; height: 280px; object-fit: cover; background: var(--paper); border: 1px solid var(--line); }
  .admin-product h4 { font-size: 1.15rem; margin: 0; font-weight: 600; font-family: 'Outfit', sans-serif; text-transform: uppercase; letter-spacing: 0.05em; color: var(--ink); }
  .admin-product .actions { display: flex; gap: 12px; margin-top: auto; padding-top: 16px; }
  
  .btn-edit { flex: 1; background: transparent; color: var(--ink); border: 1px solid var(--ink); padding: 16px; cursor: pointer; font-weight: 600; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; transition: background 0.2s, color 0.2s; }
  .btn-edit:hover { background: var(--ink); color: var(--paper); }
  .btn-del { flex: 1; background: transparent; color: var(--text-secondary); border: 1px solid var(--line); padding: 16px; cursor: pointer; font-weight: 600; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; transition: border-color 0.2s, color 0.2s; }
  .btn-del:hover { border-color: var(--ink); color: var(--ink); }
  
  .empty-msg { padding: 40px; border: 1px dashed var(--line); text-align: center; color: var(--text-secondary); font-size: 0.95rem; text-transform: uppercase; letter-spacing: 0.05em; }
</style>`;

html = html.replace(/<style>[\s\S]*?<\/style>/i, newStyle);

fs.writeFileSync(path, html);
