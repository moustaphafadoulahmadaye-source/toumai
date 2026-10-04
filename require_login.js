const fs = require('fs');
const commonFile = 'public/js/common.js';
let js = fs.readFileSync(commonFile, 'utf8');

const targetStr = `function addToCart(id){
  const cart = getCart();`;

const replacementStr = `function addToCart(id){
  const token = localStorage.getItem('kolo_token');
  if (!token) {
    alert("Veuillez vous connecter ou créer un compte pour commander.");
    window.location.href = 'login.html';
    return;
  }
  const cart = getCart();`;

if (js.includes(targetStr)) {
  js = js.replace(targetStr, replacementStr);
  fs.writeFileSync(commonFile, js);
  console.log('Updated addToCart in common.js');
} else {
  console.log('addToCart not found in common.js');
}

// Update panier.html to enforce login
const panierFile = 'public/panier.html';
let panierHtml = fs.readFileSync(panierFile, 'utf8');

const scriptStart = `<script>
  document.addEventListener('DOMContentLoaded', () => {`;

const enforceLoginScript = `<script>
  // Vérifier la connexion
  if (!localStorage.getItem('kolo_token')) {
    alert("Veuillez vous connecter pour voir votre panier.");
    window.location.href = 'login.html';
  }

  document.addEventListener('DOMContentLoaded', () => {`;

if (panierHtml.includes(scriptStart)) {
  panierHtml = panierHtml.replace(scriptStart, enforceLoginScript);
  fs.writeFileSync(panierFile, panierHtml);
  console.log('Enforced login in panier.html');
} else {
  console.log('scriptStart not found in panier.html');
}
