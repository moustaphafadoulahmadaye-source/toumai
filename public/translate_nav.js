const fs = require('fs');
const files = ['produits.html', 'panier.html', 'contact.html', 'collections.html', 'compte.html', 'login.html', 'register.html'];
for (const file of files) {
  try {
    let content = fs.readFileSync(file, 'utf8');
    
    // Desktop Nav
    content = content.replace(/<a href=\"index\.html\" class=\"nav-link\"([^>]*)>Accueil<\/a>/g, '<a href=\"index.html\" class=\"nav-link\" data-i18n=\"nav_home\"$1>Accueil</a>');
    content = content.replace(/<a href=\"produits\.html\" class=\"nav-link\"([^>]*)>Boutique<\/a>/g, '<a href=\"produits.html\" class=\"nav-link\" data-i18n=\"nav_shop\"$1>Boutique</a>');
    content = content.replace(/<a href=\"collections\.html\" class=\"nav-link\"([^>]*)>Collections<\/a>/g, '<a href=\"collections.html\" class=\"nav-link\" data-i18n=\"nav_collections\"$1>Collections</a>');
    content = content.replace(/<a href=\"contact\.html\" class=\"nav-link\"([^>]*)>Aide<\/a>/g, '<a href=\"contact.html\" class=\"nav-link\" data-i18n=\"nav_help\"$1>Aide</a>');
    content = content.replace(/<a href=\"login\.html\" class=\"nav-link\"([^>]*)>Compte<\/a>/g, '<a href=\"login.html\" class=\"nav-link\" data-i18n=\"nav_account\"$1>Compte</a>');
    
    // Uppercase ones (compte.html)
    content = content.replace(/<a href=\"index\.html\" class=\"nav-link\"([^>]*)>ACCUEIL<\/a>/g, '<a href=\"index.html\" class=\"nav-link\" data-i18n=\"nav_home\"$1>ACCUEIL</a>');
    content = content.replace(/<a href=\"produits\.html\" class=\"nav-link\"([^>]*)>BOUTIQUE<\/a>/g, '<a href=\"produits.html\" class=\"nav-link\" data-i18n=\"nav_shop\"$1>BOUTIQUE</a>');
    content = content.replace(/<a href=\"collections\.html\" class=\"nav-link\"([^>]*)>COLLECTIONS<\/a>/g, '<a href=\"collections.html\" class=\"nav-link\" data-i18n=\"nav_collections\"$1>COLLECTIONS</a>');
    content = content.replace(/<a href=\"contact\.html\" class=\"nav-link\"([^>]*)>AIDE<\/a>/g, '<a href=\"contact.html\" class=\"nav-link\" data-i18n=\"nav_help\"$1>AIDE</a>');
    content = content.replace(/<a href=\"compte\.html\" class=\"nav-link\"([^>]*)>COMPTE<\/a>/g, '<a href=\"compte.html\" class=\"nav-link\" data-i18n=\"nav_account\"$1>COMPTE</a>');

    // Mobile Nav
    content = content.replace(/<a href=\"index\.html\" class=\"mobile-menu-link\">\s*Accueil/g, '<a href=\"index.html\" class=\"mobile-menu-link\">\n      <span data-i18n=\"nav_home\">Accueil</span>');
    content = content.replace(/<a href=\"produits\.html\" class=\"mobile-menu-link\">\s*Boutique/g, '<a href=\"produits.html\" class=\"mobile-menu-link\">\n      <span data-i18n=\"nav_shop\">Boutique</span>');
    content = content.replace(/<a href=\"produits\.html\" class=\"mobile-menu-link\">\s*Produits/g, '<a href=\"produits.html\" class=\"mobile-menu-link\">\n      <span data-i18n=\"nav_shop\">Produits</span>');
    content = content.replace(/<a href=\"collections\.html\" class=\"mobile-menu-link\">\s*Collections/g, '<a href=\"collections.html\" class=\"mobile-menu-link\">\n      <span data-i18n=\"nav_collections\">Collections</span>');
    content = content.replace(/<a href=\"contact\.html\" class=\"mobile-menu-link\">\s*Contact/g, '<a href=\"contact.html\" class=\"mobile-menu-link\">\n      <span data-i18n=\"nav_help\">Contact</span>');
    
    // Mobile Bottom Nav
    content = content.replace(/<a href=\"login\.html\" class=\"btn-outline-white\">Connexion<\/a>/g, '<a href=\"login.html\" class=\"btn-outline-white\" data-i18n=\"nav_account\">Connexion</a>');
    content = content.replace(/<a href=\"produits\.html\" class=\"btn-solid-white\">Commencer maintenant<\/a>/g, '<a href=\"produits.html\" class=\"btn-solid-white\" data-i18n=\"hero_cta\">Commencer maintenant</a>');
    
    fs.writeFileSync(file, content);
    console.log('Updated ' + file);
  } catch (e) {
    console.log('Skipped ' + file);
  }
}
