PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK(category IN ('shirt','bag','phone','other')),
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

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'customer' CHECK(role IN ('customer','admin')),
  avatar_url TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  total INTEGER NOT NULL CHECK(total >= 0),
  status TEXT NOT NULL DEFAULT 'en_attente' CHECK(status IN ('en_attente','confirmee','livree','annulee')),
  delivery_date TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL CHECK(quantity > 0),
  unit_price INTEGER NOT NULL CHECK(unit_price >= 0),
  size TEXT,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE IF NOT EXISTS collections (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  name_ar TEXT,
  description TEXT,
  description_ar TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS collection_products (
  collection_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  PRIMARY KEY (collection_id, product_id),
  FOREIGN KEY (collection_id) REFERENCES collections(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

INSERT OR IGNORE INTO products (id,name,category,price,stock) VALUES
(1,'Chemise oversize lin','shirt',12000,20),(2,'Robe wax moderne','shirt',18500,15),(3,'Veste denim brodée','shirt',22000,10),(4,'T-shirt graphique','shirt',6500,30),(5,'Sac bandoulière cuir','bag',15000,12),(6,'Sac à dos urbain','bag',19500,18),(7,'Pochette tissée','bag',8000,25),(8,'Étui MagSafe premium','phone',7000,40),(9,'Écouteurs sans fil','phone',21000,22),(10,'Chargeur rapide 30W','phone',9500,35),(11,'Powerbank 10000mAh','phone',14000,20),(12,'Lunettes de soleil','other',5500,28),(13,'Montre minimaliste','other',17000,14),(14,'Casquette brodée','other',4500,33);
INSERT OR IGNORE INTO collections (id,name,name_ar,description,description_ar) VALUES
(1,'Nouvelle rentrée','مجموعة العودة','Les essentiels mode et tech pour bien commencer','أساسيات الموضة والتقنية لبداية موفقة'),
(2,'Prêt à voyager','مجموعة السفر','Sacs et accessoires pensés pour la route','حقائب وإكسسوارات مصممة للتنقل'),
(3,'Tech du quotidien','التقنية اليومية','Les accessoires téléphone les plus utiles','أكثر إكسسوارات الهاتف فائدة');
INSERT OR IGNORE INTO collection_products (collection_id,product_id) VALUES
(1,1),(1,4),(1,9),(1,12),(2,5),(2,6),(2,7),(2,11),(3,8),(3,9),(3,10),(3,11);
