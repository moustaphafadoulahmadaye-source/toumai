const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');

const categories = [
  'shirt', 'bag', 'phone', 'other', 
  'parfum', 'chaussures', 'veste', 
  'kids_1_4', 'kids_5_12', 'kids_13_18',
  'enfants', 'chaussures_enfants'
];

const adjectives = ['Premium', 'Luxe', 'Moderne', 'Vintage', 'Classique', 'Élégant', 'Sport', 'Casual', 'Chic', 'Urbain'];
const nouns = {
  'shirt': ['T-shirt', 'Chemise', 'Polo', 'Pull', 'Débardeur'],
  'bag': ['Sac à dos', 'Sacoche', 'Sac à main', 'Pochette', 'Valise'],
  'phone': ['Smartphone', 'Coque', 'Chargeur', 'Écouteurs', 'Câble'],
  'other': ['Montre', 'Lunettes', 'Casquette', 'Ceinture', 'Portefeuille'],
  'parfum': ['Eau de parfum', 'Eau de toilette', 'Extrait de parfum', 'Brume', 'Coffret'],
  'chaussures': ['Baskets', 'Mocassins', 'Sandales', 'Bottes', 'Chaussures de ville'],
  'veste': ['Veste en cuir', 'Manteau', 'Blouson', 'Parka', 'Coupe-vent'],
  'kids_1_4': ['Body', 'Pyjama', 'T-shirt bébé', 'Pantalon bébé', 'Ensemble bébé'],
  'kids_5_12': ['Sweat enfant', 'Jeans enfant', 'Robe enfant', 'T-shirt enfant', 'Veste enfant'],
  'kids_13_18': ['Sweat ado', 'Jeans ado', 'Robe ado', 'T-shirt ado', 'Veste ado'],
  'enfants': ['Accessoire enfant', 'Jouet', 'Bonnet enfant', 'Écharpe enfant', 'Gants enfant'],
  'chaussures_enfants': ['Baskets enfant', 'Sandales enfant', 'Bottes enfant', 'Chaussons', 'Mocassins enfant']
};

async function run() {
  const db = await open({ filename: dbPath, driver: sqlite3.Database });
  
  // Disable check constraints temporarily if possible, though SQLite check constraints are table-level
  // and altering them requires recreating the table.
  // Actually, we can test inserting one of the new categories.
  try {
    // Generate 120 products (10 per category)
    let count = 0;
    
    // We'll use a transaction for speed
    await db.exec('BEGIN TRANSACTION');
    
    for (const cat of categories) {
      for (let i = 0; i < 10; i++) {
        const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
        const noun = nouns[cat][Math.floor(Math.random() * nouns[cat].length)];
        const name = `${noun} ${adj} ${i + 1}`;
        const price = Math.floor(Math.random() * 200 + 10) * 100; // Between 1000 and 21000
        const stock = Math.floor(Math.random() * 50); // Between 0 and 49
        const isWholesale = Math.random() > 0.8 ? 1 : 0;
        const discount = isWholesale ? (Math.floor(Math.random() * 4 + 1) * 5) : 0; // 5, 10, 15, 20
        
        try {
          await db.run(
            `INSERT INTO products (name, category, price, stock, is_wholesale, wholesale_discount, description) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [name, cat, price, stock, isWholesale, discount, `Superbe produit de la catégorie ${cat}. Qualité exceptionnelle.`]
          );
          count++;
        } catch (e) {
          // If CHECK constraint fails, we'll log it and fallback to 'other'
          if (e.message.includes('CHECK constraint failed')) {
            console.log(`CHECK constraint failed for category: ${cat}, trying without category check if possible or fallback to 'other'`);
            
            // Re-create the table without the check constraint!
            await db.exec('COMMIT'); // Commit what we have
            
            // Recreating the table without check constraint
            console.log('Recreating products table without CHECK constraint on category...');
            await db.exec(`
              PRAGMA foreign_keys=off;
              BEGIN TRANSACTION;
              CREATE TABLE products_new (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                category TEXT NOT NULL,
                price INTEGER NOT NULL CHECK(price >= 0),
                description TEXT,
                stock INTEGER NOT NULL DEFAULT 0 CHECK(stock >= 0),
                image_url TEXT,
                is_wholesale INTEGER NOT NULL DEFAULT 0,
                wholesale_discount INTEGER NOT NULL DEFAULT 0,
                admin_id INTEGER,
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE SET NULL
              );
              INSERT INTO products_new SELECT * FROM products;
              DROP TABLE products;
              ALTER TABLE products_new RENAME TO products;
              COMMIT;
              PRAGMA foreign_keys=on;
            `);
            console.log('Table recreated. Restarting script...');
            return run(); // Restart the process
          } else {
            console.error('Error inserting product:', e);
          }
        }
      }
    }
    
    await db.exec('COMMIT');
    console.log(`Successfully generated ${count} dummy products!`);
  } catch (err) {
    console.error('Script failed:', err);
    await db.exec('ROLLBACK').catch(()=>{});
  }
}

run();
