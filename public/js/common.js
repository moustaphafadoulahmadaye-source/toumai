// Icônes réutilisées sur toutes les pages
const ICONS = {
  shirt: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M8 4L4 7l2 3 2-1v11h8V9l2 1 2-3-4-3-2 2h-4L8 4z"/></svg>`,
  bag: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 8h12l1 12H5L6 8z"/><path d="M9 8V6a3 3 0 016 0v2"/></svg>`,
  phone: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/></svg>`,
  other: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="9"/><path d="M9 12h6M12 9v6"/></svg>`,
  parfum: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M9 3h6v3H9zM7 6h10a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z"/><path d="M12 11v5M9.5 13.5h5"/></svg>`,
  chaussures: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 18h18v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2z"/><path d="M7 12V8a5 5 0 0 1 10 0v4"/></svg>`,
  veste: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 7l4-3h10l4 3v14H3V7z"/><path d="M9 4v8M15 4v8M9 12h6"/></svg>`,
  enfants: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="6" r="3"/><path d="M9 10h6a4 4 0 0 1 4 4v7h-3v-5h-4v5H9v-7a4 4 0 0 1 4-4z"/></svg>`,
  chaussures_enfants: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 18h16v-2a3 3 0 0 0-3-3H7a3 3 0 0 0-3 3v2z"/><path d="M7 13V9a4 4 0 0 1 8 0v4"/></svg>`,
  gros: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>`
};
const CAT_COLORS = { shirt:"#F2A93B", bag:"#E2683C", phone:"#171D33", other:"#8FA0A8", parfum:"#C77DFF", chaussures:"#4CC9F0", veste:"#2D6A4F", enfants:"#FFB703", chaussures_enfants:"#00B4D8", gros:"#E63946" };
const CAT_LABELS = { all:"Tous", shirt:"Vêtements", bag:"Sacs", phone:"Téléphones", other:"Divers", parfum:"Parfums", chaussures:"Chaussures", veste:"Vestes", enfants:"Enfants", chaussures_enfants:"Chaussures Enfants", gros:"Vente en Gros" }; // repli si i18n indisponible
function catLabel(cat){ return t('cat_' + cat); }

function fmt(n){ return Number(n).toLocaleString('fr-FR') + " FCFA"; }

// --- Panier stocké dans localStorage : { [productId]: quantity } ---

function getCartKey() {
  try {
    const userStr = localStorage.getItem('kolo_user');
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user && user.id) return 'kolo_cart_' + user.id;
    }
  } catch(e) {}
  return 'kolo_cart';
}

function getCart(){
  try { return JSON.parse(localStorage.getItem(getCartKey()) || '{}'); }
  catch(e){ return {}; }
}
function saveCart(cart){
  try { localStorage.setItem(getCartKey(), JSON.stringify(cart)); }
  catch(e){ /* stockage indisponible */ }
}
function addToCart(id, qty = 1){
  const token = localStorage.getItem('kolo_token');
  if (!token) {
    showAuthModal();
    return;
  }
  const cart = getCart();
  cart[id] = (cart[id] || 0) + qty;
  saveCart(cart);
  updateCartBadge();
}
function setQty(id, qty){
  const cart = getCart();
  if(qty <= 0) delete cart[id];
  else cart[id] = qty;
  saveCart(cart);
  updateCartBadge();
}
function cartCount(){
  const cart = getCart();
  return Object.values(cart).reduce((a,b)=>a+b,0);
}
function updateCartBadge(){
  const count = cartCount();
  document.querySelectorAll('.cart-count, #cartCount').forEach(el => {
    el.textContent = count;
  });
}
document.addEventListener('DOMContentLoaded', updateCartBadge);

// --- Traduction FR / AR ---
const I18N = {
  fr: {
    cart: "Panier", continue_shopping: "Continuer mes achats",
    hero_title: "Vêtements, sacs et téléphones — tout au même endroit.",
    hero_text: "La boutique en ligne qui rassemble mode moderne, accessoires et tech du quotidien, livrés chez vous.",
    hero_cta: "Voir le catalogue ↓",
    cat_all: "Tous", cat_shirt: "Vêtements", cat_bag: "Sacs", cat_phone: "Téléphones", cat_other: "Divers", cat_parfum: "Parfums", cat_chaussures: "Chaussures / Sandales", cat_veste: "Vestes / Manteaux", cat_enfants: "Enfants (Général)", cat_chaussures_enfants: "Chaussures Enfants", cat_kids_1_4: "Enfants (1 à 4 ans)", cat_kids_5_12: "Enfants (5 à 12 ans)", cat_kids_13_18: "Ados (13 à 18 ans)", cat_gros: "Vente en Gros",
    all_products: "Tous les produits", loading: "Chargement…", no_product: "Aucun produit dans cette catégorie.",
    server_error: "Impossible de joindre le serveur — vérifiez que l'API tourne.",
    cart_title: "Votre panier", cart_empty: "Votre panier est vide.", see_catalog: "Voir le catalogue",
    total: "Total", full_name: "Nom complet", email: "Adresse email", phone: "Numéro de téléphone",
    address: "Adresse de livraison", order_btn: "Commander", sending: "Envoi en cours…",
    order_failed: "La commande a échoué, réessayez.", cart_load_error: "Impossible de charger le panier — vérifiez que le serveur/API tourne.",
    footer: "Boutique Toumaï — paiement à la livraison disponible",
    nav_home: "Accueil", nav_shop: "Boutique", nav_help: "Aide", nav_account: "Compte",
    nav_collections: "Collections", collections_title: "Nos collections",
    collections_sub: "Des sélections pensées par thème", no_collection: "Aucune collection pour le moment."
  },
    en: {
    cart: "Cart", continue_shopping: "Continue Shopping",
    hero_title: "Clothing, bags and phones — all in one place.",
    hero_text: "The online store that brings together modern fashion, accessories, and everyday tech, delivered to your door.",
    hero_cta: "View Catalog ↓",
    cat_all: "All", cat_shirt: "Clothing", cat_bag: "Bags", cat_phone: "Phones", cat_other: "Other", cat_parfum: "Perfumes", cat_chaussures: "Shoes / Sandals", cat_veste: "Jackets / Coats", cat_enfants: "Kids (General)", cat_chaussures_enfants: "Kids Shoes", cat_kids_1_4: "Kids (1-4 yrs)", cat_kids_5_12: "Kids (5-12 yrs)", cat_kids_13_18: "Teens (13-18 yrs)", cat_gros: "Wholesale",
    all_products: "All Products", loading: "Loading...", no_product: "No products in this category.",
    server_error: "Cannot connect to server — check if API is running.",
    cart_title: "Your Cart", cart_empty: "Your cart is empty.", see_catalog: "View Catalog",
    total: "Total", full_name: "Full Name", email: "Email Address", phone: "Phone Number",
    address: "Delivery Address", order_btn: "Order Now", sending: "Sending...",
    order_failed: "Order failed, try again.", cart_load_error: "Cannot load cart — check server.",
    footer: "Boutique Toumaï — cash on delivery available",
    nav_home: "Home", nav_shop: "Shop", nav_help: "Help", nav_account: "Account",
    nav_collections: "Collections", collections_title: "Our Collections",
    collections_sub: "Curated selections by theme", no_collection: "No collections available."
  },
  ar: {
    cart: "السلة", continue_shopping: "متابعة التسوق",
    hero_title: "ملابس، حقائب وهواتف — كل شيء في مكان واحد.",
    hero_text: "المتجر الإلكتروني الذي يجمع الموضة العصرية والإكسسوارات والتقنية اليومية، يصلك إلى باب منزلك.",
    hero_cta: "شاهد الكتالوج ↓",
    cat_all: "الكل", cat_shirt: "ملابس", cat_bag: "حقائب", cat_phone: "هواتف", cat_other: "متنوع", cat_parfum: "عطور", cat_chaussures: "أحذية / صنادل", cat_veste: "سترات / معاطف", cat_enfants: "أطفال", cat_chaussures_enfants: "أحذية أطفال", cat_kids_1_4: "أطفال (1-4 سنوات)", cat_kids_5_12: "أطفال (5-12 سنوات)", cat_kids_13_18: "مراهقين (13-18 سنة)", cat_gros: "بيع بالجملة",
    all_products: "كل المنتجات", loading: "جارٍ التحميل…", no_product: "لا يوجد منتج في هذه الفئة.",
    server_error: "تعذر الاتصال بالخادم — تأكد أن الـ API يعمل.",
    cart_title: "سلة التسوق", cart_empty: "سلتك فارغة.", see_catalog: "شاهد الكتالوج",
    total: "المجموع", full_name: "الاسم الكامل", email: "البريد الإلكتروني", phone: "رقم الهاتف",
    address: "عنوان التوصيل", order_btn: "اطلب الآن", sending: "جارٍ الإرسال…",
    order_failed: "فشل الطلب، حاول مرة أخرى.", cart_load_error: "تعذر تحميل السلة — تأكد أن الخادم يعمل.",
    footer: "كولو ماركت — الدفع عند الاستلام متاح",
    nav_home: "الرئيسية", nav_shop: "المتجر", nav_help: "مساعدة", nav_account: "الحساب",
    nav_collections: "المجموعات", collections_title: "مجموعاتنا",
    collections_sub: "تشكيلات مختارة حسب الموضوع", no_collection: "لا توجد مجموعة حالياً."
  }
};

function getLang(){
  return localStorage.getItem('kolo_lang') || 'fr';
}
function t(key){
  const lang = getLang();
  return (I18N[lang] && I18N[lang][key]) || I18N.fr[key] || key;
}
function setLang(lang){
  localStorage.setItem('kolo_lang', lang);
  applyDocDirection();
  applyTranslations();
  window.location.reload();
}
function applyDocDirection(){
  const lang = getLang();
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
}
function applyTranslations(){
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.getAttribute('data-i18n'));
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.placeholder = t(el.getAttribute('data-i18n-placeholder'));
  });
  const switcher = document.getElementById('langSwitch');
  if(switcher) switcher.textContent = getLang() === 'fr' ? 'FR / عربي' : 'عربي / FR';
}
function toggleLang(){
  setLang(getLang() === 'fr' ? 'ar' : 'fr');
  if(typeof onLangChange === 'function') onLangChange();
}
// --- Theme Toggle ---
function getTheme(){
  return localStorage.getItem('kolo_theme') || 'light';
}
function applyTheme(){
  const theme = getTheme();
  document.documentElement.setAttribute('data-theme', theme);
  const btns = [document.getElementById('themeToggleBtn'), document.getElementById('themeToggle')];
  
  btns.forEach(btn => {
    if(btn){
      if(theme === 'dark'){
        // Moon icon
        btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></svg>`;
      } else {
        // Sun icon
        btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
      }
    }
  });
}
applyTheme(); // Appliquer le thème dès le chargement du script pour éviter le "flash"

function toggleTheme(){
  const newTheme = getTheme() === 'light' ? 'dark' : 'light';
  localStorage.setItem('kolo_theme', newTheme);
  applyTheme();
}

function injectThemeButton() {
  let btn = document.getElementById('themeToggleBtn');
  let btn2 = document.getElementById('themeToggle');
  
  if (!btn && !btn2) {
    const headerRight = document.querySelector('.header-right');
    if(headerRight) {
      btn = document.createElement('button');
      btn.id = 'themeToggleBtn';
      btn.className = 'theme-toggle-btn';
      btn.title = "Changer de thème";
      const cartBtn = headerRight.querySelector('.cart-btn');
      if(cartBtn) {
        headerRight.insertBefore(btn, cartBtn);
      } else {
        headerRight.appendChild(btn);
      }
    }
  }
  
  if (btn) btn.onclick = toggleTheme;
  if (btn2) btn2.onclick = toggleTheme;
  applyTheme(); // update icon
}

document.addEventListener('DOMContentLoaded', () => {
  applyDocDirection();
  applyTranslations();
  injectThemeButton();
});

document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('kolo_token');
  if (token) {
    const compteLinks = document.querySelectorAll('a[href="login.html"]');
    compteLinks.forEach(link => {
      // Si c'est le lien COMPTE, changer pour compte.html
      if (link.textContent.trim().toUpperCase() === 'COMPTE' || link.dataset.i18n === 'nav_account') {
        link.href = 'compte.html';
      }
    });
  }
});


function showAuthModal() {
  const modalHtml = `
    <div id="authOverlay" style="position:fixed; inset:0; background:rgba(255,255,255,0.7); backdrop-filter:blur(12px); -webkit-backdrop-filter:blur(12px); z-index:9999; display:flex; align-items:center; justify-content:center; padding:20px; animation:authFadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);">
      <div style="background:#ffffff; width:100%; max-width:440px; border-radius:36px; padding:48px 40px; box-shadow:0 30px 60px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.03); text-align:center; position:relative; animation:authSlideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1);">
        
        <button onclick="document.getElementById('authOverlay').remove()" style="position:absolute; top:24px; right:24px; width:40px; height:40px; background:#f9fafb; border-radius:50%; border:none; cursor:pointer; color:#6b7280; display:flex; align-items:center; justify-content:center; transition:all 0.2s;" onmouseover="this.style.background='#f3f4f6'; this.style.color='#111'" onmouseout="this.style.background='#f9fafb'; this.style.color='#6b7280'">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
        
        <div style="width:88px; height:88px; background:linear-gradient(135deg, var(--ink), #333); border-radius:28px; display:flex; align-items:center; justify-content:center; margin:0 auto 32px; color:#fff; box-shadow:0 16px 32px rgba(0,0,0,0.15); transform:rotate(-6deg);">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="transform:rotate(6deg);"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
        </div>
        
        <h3 style="font-family:'Outfit', sans-serif; font-size:1.9rem; font-weight:800; color:var(--ink); margin-bottom:12px; letter-spacing:-0.04em;">Authentification</h3>
        <p style="color:#6b7280; font-size:1.1rem; line-height:1.6; margin-bottom:40px;">Veuillez vous identifier pour ajouter des pépites à votre panier et poursuivre vos achats.</p>
        
        <a href="login.html" class="premium-auth-btn" style="display:flex; justify-content:center; align-items:center; gap:12px; width:100%; background:var(--ink); color:#fff; text-decoration:none; padding:18px; border-radius:100px; font-weight:600; font-size:1.15rem; transition:all 0.3s cubic-bezier(0.16, 1, 0.3, 1); box-shadow:0 12px 24px rgba(0,0,0,0.12);">
          Continuer vers la connexion
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </a>
      </div>
    </div>
    <style>
      @keyframes authFadeIn { from { opacity:0; } to { opacity:1; } }
      @keyframes authSlideUp { from { opacity:0; transform:translateY(40px) scale(0.95); } to { opacity:1; transform:translateY(0) scale(1); } }
      .premium-auth-btn:hover { transform: translateY(-2px); box-shadow: 0 16px 32px rgba(0,0,0,0.18); background: #222; }
      .premium-auth-btn:active { transform: translateY(1px); box-shadow: 0 6px 12px rgba(0,0,0,0.1); }
    </style>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHtml);
}
