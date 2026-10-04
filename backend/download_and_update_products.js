const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const imagesDir = path.join(__dirname, '../public/images/products');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Curated list of genuine product photos from Unsplash
const catalog = {
  // PULL / SWEAT
  'pull': [
    'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&auto=format&fit=crop&q=80'
  ],
  // T-SHIRT
  'tshirt': [
    'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&auto=format&fit=crop&q=80'
  ],
  // POLO
  'polo': [
    'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1626497764746-6dc36546b388?w=600&auto=format&fit=crop&q=80'
  ],
  // CHEMISE
  'chemise': [
    'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=80'
  ],
  // DEBARDEUR
  'debardeur': [
    'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&auto=format&fit=crop&q=80'
  ],
  // ROBE
  'robe': [
    'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&auto=format&fit=crop&q=80'
  ],
  // VALISE
  'valise': [
    'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1581553680321-4fffae59fccd?w=600&auto=format&fit=crop&q=80'
  ],
  // POCHETTE
  'pochette': [
    'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&auto=format&fit=crop&q=80'
  ],
  // SAC A DOS / SAC A MAIN
  'sac': [
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&auto=format&fit=crop&q=80'
  ],
  // SACOCHE
  'sacoche': [
    'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=600&auto=format&fit=crop&q=80'
  ],
  // BASKETS / SNEAKERS
  'baskets': [
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&auto=format&fit=crop&q=80'
  ],
  // MOCASSINS / CHAUSSURES DE VILLE
  'mocassins': [
    'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=600&auto=format&fit=crop&q=80'
  ],
  // SANDALES
  'sandales': [
    'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=600&auto=format&fit=crop&q=80'
  ],
  // BOTTES
  'bottes': [
    'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=600&auto=format&fit=crop&q=80'
  ],
  // VESTE / MANTEAU
  'veste': [
    'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600&auto=format&fit=crop&q=80'
  ],
  // SMARTPHONE
  'smartphone': [
    'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80'
  ],
  // ECOUTEURS
  'ecouteurs': [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80'
  ],
  // ACCESSOIRES PHONE
  'accessoire_phone': [
    'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1609592424369-026034177bdf?w=600&auto=format&fit=crop&q=80'
  ],
  // PARFUM
  'parfum': [
    'https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600&auto=format&fit=crop&q=80'
  ],
  // MONTRE
  'montre': [
    'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80'
  ],
  // LUNETTES
  'lunettes': [
    'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&auto=format&fit=crop&q=80'
  ],
  // CASQUETTE
  'casquette': [
    'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&auto=format&fit=crop&q=80'
  ],
  // CEINTURE
  'ceinture': [
    'https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=600&auto=format&fit=crop&q=80'
  ],
  // PORTEFEUILLE
  'portefeuille': [
    'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&auto=format&fit=crop&q=80'
  ],
  // ENFANTS VETEMENTS
  'enfants': [
    'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600&auto=format&fit=crop&q=80'
  ],
  // ENFANTS CHAUSSURES
  'enfants_chaussures': [
    'https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&auto=format&fit=crop&q=80'
  ],
  // JOUET / ACCESSOIRE
  'jouet': [
    'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600&auto=format&fit=crop&q=80'
  ]
};

async function downloadFile(url, dest) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const buffer = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(dest, buffer);
    return true;
  } catch (err) {
    console.warn(`Failed downloading ${url}:`, err.message);
    return false;
  }
}

async function run() {
  console.log('--- Step 1: Downloading genuine product photos ---');
  const localCatalog = {};

  for (const [key, urls] of Object.entries(catalog)) {
    localCatalog[key] = [];
    for (let i = 0; i < urls.length; i++) {
      const fileName = `${key}_${i + 1}.jpg`;
      const filePath = path.join(imagesDir, fileName);
      const webPath = `/images/products/${fileName}`;
      
      if (!fs.existsSync(filePath)) {
        console.log(`Downloading ${key} (${i + 1}/${urls.length})...`);
        const ok = await downloadFile(urls[i], filePath);
        if (ok) {
          localCatalog[key].push(webPath);
        }
      } else {
        localCatalog[key].push(webPath);
      }
    }
  }

  // Fallback defaults from existing images if any key has 0 items
  const fallbacks = {
    'pull': ['/images/product_shirt.jpg'],
    'tshirt': ['/images/product_shirt.jpg'],
    'polo': ['/images/product_shirt.jpg'],
    'chemise': ['/images/product_shirt.jpg'],
    'debardeur': ['/images/product_shirt.jpg'],
    'robe': ['/images/product_shirt.jpg'],
    'valise': ['/images/product_bag.jpg'],
    'pochette': ['/images/product_bag.jpg'],
    'sac': ['/images/product_bag.jpg'],
    'sacoche': ['/images/product_bag.jpg'],
    'baskets': ['/images/product_chaussures.jpg', '/uploads/demo_chaussures.jpg'],
    'mocassins': ['/images/product_chaussures.jpg'],
    'sandales': ['/images/product_chaussures.jpg'],
    'bottes': ['/images/product_chaussures.jpg'],
    'veste': ['/images/product_veste.jpg', '/uploads/demo_veste.jpg'],
    'smartphone': ['/images/product_phone.jpg'],
    'ecouteurs': ['/images/product_phone.jpg'],
    'accessoire_phone': ['/images/product_phone.jpg'],
    'parfum': ['/images/product_parfum.jpg', '/uploads/demo_parfum.jpg'],
    'montre': ['/images/product_other.jpg'],
    'lunettes': ['/images/product_other.jpg'],
    'casquette': ['/images/product_other.jpg'],
    'ceinture': ['/images/product_ceinture.jpg'],
    'portefeuille': ['/images/product_other.jpg'],
    'enfants': ['/images/product_enfants.jpg', '/uploads/demo_enfants.jpg'],
    'enfants_chaussures': ['/images/product_chaussures_enfants.jpg', '/uploads/demo_chaussures_enfants.jpg'],
    'jouet': ['/images/product_enfants.jpg']
  };

  for (const k of Object.keys(fallbacks)) {
    if (!localCatalog[k] || localCatalog[k].length === 0) {
      localCatalog[k] = fallbacks[k];
    }
  }

  console.log('--- Step 2: Mapping SQLite products to genuine product images ---');
  const db = new sqlite3.Database(path.join(__dirname, 'database.sqlite'));

  db.all('SELECT id, name, category, image_url FROM products', (err, rows) => {
    if (err) {
      console.error('Error fetching products:', err);
      return;
    }

    const updates = [];

    rows.forEach(product => {
      const name = (product.name || '').toLowerCase();
      const cat = (product.category || '').toLowerCase();
      let key = null;

      // Match noun first
      if (name.includes('pull') || name.includes('sweat')) key = 'pull';
      else if (name.includes('t-shirt') || name.includes('tshirt')) {
        if (cat.includes('kids') || cat.includes('enfant')) key = 'enfants';
        else key = 'tshirt';
      }
      else if (name.includes('polo')) key = 'polo';
      else if (name.includes('chemise')) key = 'chemise';
      else if (name.includes('débardeur') || name.includes('debardeur')) key = 'debardeur';
      else if (name.includes('robe')) {
        if (cat.includes('kids') || cat.includes('enfant')) key = 'enfants';
        else key = 'robe';
      }
      else if (name.includes('valise')) key = 'valise';
      else if (name.includes('pochette')) key = 'pochette';
      else if (name.includes('sacoche')) key = 'sacoche';
      else if (name.includes('sac')) key = 'sac';
      else if (name.includes('basket') || name.includes('sneaker')) {
        if (cat.includes('enfant')) key = 'enfants_chaussures';
        else key = 'baskets';
      }
      else if (name.includes('mocassin')) {
        if (cat.includes('enfant')) key = 'enfants_chaussures';
        else key = 'mocassins';
      }
      else if (name.includes('sandale')) {
        if (cat.includes('enfant')) key = 'enfants_chaussures';
        else key = 'sandales';
      }
      else if (name.includes('botte') || name.includes('chausson')) {
        if (cat.includes('enfant')) key = 'enfants_chaussures';
        else key = 'bottes';
      }
      else if (name.includes('veste') || name.includes('manteau') || name.includes('blouson') || name.includes('parka') || name.includes('coupe-vent')) {
        if (cat.includes('kids') || cat.includes('enfant')) key = 'enfants';
        else key = 'veste';
      }
      else if (name.includes('smartphone')) key = 'smartphone';
      else if (name.includes('écouteur') || name.includes('ecouteur')) key = 'ecouteurs';
      else if (name.includes('coque') || name.includes('étui') || name.includes('etui') || name.includes('chargeur') || name.includes('câble') || name.includes('cable') || name.includes('powerbank')) key = 'accessoire_phone';
      else if (name.includes('parfum') || name.includes('eau') || name.includes('extrait') || name.includes('brume') || name.includes('coffret')) key = 'parfum';
      else if (name.includes('montre')) key = 'montre';
      else if (name.includes('lunette')) key = 'lunettes';
      else if (name.includes('casquette')) key = 'casquette';
      else if (name.includes('ceinture')) key = 'ceinture';
      else if (name.includes('portefeuille')) key = 'portefeuille';
      else if (name.includes('pyjama') || name.includes('body') || name.includes('pantalon') || name.includes('ensemble') || name.includes('jeans')) {
        if (cat.includes('kids') || cat.includes('enfant')) key = 'enfants';
        else key = 'shirt';
      }
      else if (name.includes('jouet')) key = 'jouet';
      else if (name.includes('bonnet') || name.includes('écharpe') || name.includes('gant') || name.includes('accessoire')) {
        if (cat.includes('kids') || cat.includes('enfant')) key = 'enfants';
        else key = 'other';
      }
      // Fallback by category
      else if (cat === 'shirt') key = 'tshirt';
      else if (cat === 'bag') key = 'sac';
      else if (cat === 'phone') key = 'smartphone';
      else if (cat === 'other') key = 'montre';
      else if (cat === 'parfum') key = 'parfum';
      else if (cat === 'chaussures') key = 'baskets';
      else if (cat === 'veste') key = 'veste';
      else if (cat.includes('chaussures_enfants')) key = 'enfants_chaussures';
      else if (cat.includes('kids') || cat.includes('enfant')) key = 'enfants';
      else key = 'shirt';

      const pool = localCatalog[key] || localCatalog['shirt'] || ['/images/product_shirt.jpg'];
      // Deterministically pick an image from the pool based on product.id so it is consistent
      const selectedImage = pool[product.id % pool.length];

      // Update product if it had picsum, empty, or placeholder image
      if (!product.image_url || product.image_url.includes('picsum.photos') || product.image_url.includes('via.placeholder') || product.image_url.startsWith('/images/product_')) {
        updates.push({ id: product.id, image_url: selectedImage, name: product.name });
      }
    });

    console.log(`Found ${updates.length} products to update with real images.`);
    
    db.serialize(() => {
      const stmt = db.prepare('UPDATE products SET image_url = ? WHERE id = ?');
      updates.forEach(u => {
        stmt.run(u.image_url, u.id);
      });
      stmt.finalize(() => {
        console.log('All product images have been updated in SQLite successfully!');
        
        // Check first 10 updated
        db.all('SELECT id, name, category, image_url FROM products WHERE id >= 28 LIMIT 12', (err, rows) => {
          console.log('Sample updated products:');
          console.table(rows);
          db.close();
        });
      });
    });
  });
}

run();
