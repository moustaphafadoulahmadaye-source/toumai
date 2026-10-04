
  let PRODUCTS = []; // rempli depuis l'API pour avoir noms/prix/catégories à jour

  async function loadAndRender(){
    const cart = getCart();
    const ids = Object.keys(cart);
    if(ids.length === 0){
      document.getElementById('items').innerHTML = `<div class="empty-msg">${t('cart_empty')} <a href="produits.html">${t('see_catalog')}</a></div>`;
      document.getElementById('summary').style.display = 'none';
      return;
    }
    try {
      const uniqueBaseIds = [...new Set(ids.map(id => parseInt(id)))];
      const results = await Promise.all(uniqueBaseIds.map(baseId => fetch(`/api/products/${baseId}`).then(r => r.ok ? r.json() : null)));
      PRODUCTS = results.filter(Boolean);
    } catch(err){
      document.getElementById('items').innerHTML = `<div class="empty-msg">${t('cart_load_error')}</div>`;
      return;
    }
    renderItems(cart);
  }

    function renderItems(cart){
    const cartKeys = Object.keys(cart);
    let validCount = 0;
    const rows = cartKeys.map(cartId => {
      const baseId = parseInt(cartId);
      const variant = cartId.includes('_') ? cartId.split('_')[1] : null;
      const p = PRODUCTS.find(prod => prod.id === baseId);
      if(!p) {
        delete cart[cartId];
        return '';
      }
      validCount++;
      
      const qty = cart[cartId];
      const variantText = variant ? `<div style="font-size: 0.8rem; color: var(--ink); margin-top: 4px; font-weight: 600;">Option : ${variant}</div>` : '';

      return `
        <div style="display: flex; gap: 32px; padding-bottom: 32px; border-bottom: 1px solid var(--line); align-items: stretch;">
          
          <div style="width: 120px; height: 160px; background: ${CAT_COLORS[p.category]}15; color: ${CAT_COLORS[p.category]}; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; overflow: hidden; position: relative;">
            ${p.image_url 
              ? \`<img src="${p.image_url}" style="width:100%; height:100%; object-fit:cover;" alt="${p.name}">\`
              : \`<div style="transform: scale(2); opacity: 0.8; display: flex; align-items: center; justify-content: center;">${ICONS[p.category]}</div>\`
            }
          </div>

          <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between; padding: 4px 0;">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                <h3 style="font-size: 1.25rem; font-weight: 600; font-family: 'Outfit', sans-serif; color: var(--ink); margin: 0;">${p.name}</h3>
                <button onclick="changeQty('${cartId}', 0)" style="background: none; border: none; cursor: pointer; color: var(--text-secondary); padding: 4px; transition: color 0.2s;" onmouseover="this.style.color='red'" onmouseout="this.style.color='var(--text-secondary)'" title="Retirer l'article">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>
              <div style="font-size: 0.85rem; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.05em; font-weight: 500;">${catLabel(p.category)}</div>
              ${variantText}
            </div>

            <div style="display: flex; justify-content: space-between; align-items: flex-end;">
              <div style="display: flex; align-items: center; border: 1px solid var(--line); border-radius: 6px; overflow: hidden;">
                <button onclick="changeQty('${cartId}', ${qty - 1})" style="background: transparent; border: none; padding: 8px 12px; cursor: pointer; color: var(--ink); font-size: 1.2rem; transition: background 0.2s;" onmouseover="this.style.background='rgba(0,0,0,0.05)'" onmouseout="this.style.background='transparent'">−</button>
                <span style="font-size: 0.95rem; font-weight: 600; width: 40px; text-align: center; color: var(--ink);">${qty}</span>
                <button onclick="changeQty('${cartId}', ${qty + 1})" style="background: transparent; border: none; padding: 8px 12px; cursor: pointer; color: var(--ink); font-size: 1.2rem; transition: background 0.2s;" onmouseover="this.style.background='rgba(0,0,0,0.05)'" onmouseout="this.style.background='transparent'">+</button>
              </div>
              <div style="font-size: 1.15rem; font-weight: 600; color: var(--ink);">${fmt(p.price * qty)}</div>
            </div>
          </div>
        </div>
      `;
    }).join('');
    document.getElementById('items').innerHTML = rows;
    saveCart(cart);
    updateCartBadge();
    if (validCount === 0) {
      document.getElementById('items').innerHTML = \`<div class="empty-msg">\${t('cart_empty')} <a href="produits.html">\${t('see_catalog')}</a></div>\`;
      document.getElementById('summary').style.display = 'none';
      return;
    }

    const subtotal = Object.keys(cart).reduce((s, cartId) => {
      const baseId = parseInt(cartId);
      const p = PRODUCTS.find(prod => prod.id === baseId);
      if(!p) return s;
      return s + p.price * cart[cartId];
    }, 0);
    document.getElementById('subtotal').textContent = fmt(subtotal);
      document.getElementById('total').textContent = fmt(subtotal + 2000);
    document.getElementById('summary').style.display = PRODUCTS.length ? 'block' : 'none';
  }

  function changeQty(id, qty){
    setQty(id, qty);
    loadAndRender();
  }

  document.getElementById('checkoutForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const cart = getCart();
    const items = Object.entries(cart).map(([cartId, quantity]) => {
      const baseId = parseInt(cartId);
      const size = cartId.includes('_') ? cartId.split('_')[1] : null;
      return { product_id: baseId, quantity, size };
    });
    const payload = {
      customer_name: document.getElementById('customer_name').value.trim(),
      email: document.getElementById('email').value.trim(),
      phone: document.getElementById('phone').value.trim(),
      address: document.getElementById('address').value.trim(),
      items
    };
    const msg = document.getElementById('formMsg');
    msg.textContent = t('sending');
    msg.className = 'form-msg';
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if(!res.ok) throw new Error(data.error || 'Erreur');
      msg.textContent = `#${data.order_id} — ${fmt(data.total)}`;
      msg.className = 'form-msg ok';
      saveCart({});
      updateCartBadge();
      document.getElementById('checkoutForm').reset();
      setTimeout(loadAndRender, 1500);
    } catch(err){
      msg.textContent = err.message || t('order_failed');
      msg.className = 'form-msg err';
    }
  });

  function onLangChange(){ loadAndRender(); }


  // Auto-fill customer info if logged in
  const userStr = localStorage.getItem('kolo_user');
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      if (user.name) document.getElementById('customer_name').value = user.name;
      if (user.email) document.getElementById('email').value = user.email;
    } catch(e) {}
  }


  loadAndRender();
