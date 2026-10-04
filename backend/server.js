const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const db = require('./db');
const { router: authRouter } = require('./routes/auth');
const productsRouter = require('./routes/products');
const ordersRouter = require('./routes/orders');
const collectionsRouter = require('./routes/collections');
const contactRouter = require('./routes/contact');

const app = express();
app.disable('x-powered-by');

const allowedOrigins = (process.env.CORS_ORIGIN || '').split(',').map(s => s.trim()).filter(Boolean);
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      return cb(null, true);
    }
    cb(new Error('CORS origin denied'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '100kb' }));

const rate = new Map();
app.use('/api/auth', (req, res, next) => {
  const key = req.ip;
  const now = Date.now();
  const r = rate.get(key) || { n: 0, t: now };
  if (now - r.t > 15 * 60 * 1000) {
    r.n = 0;
    r.t = now;
  }
  r.n++;
  rate.set(key, r);
  if (r.n > 100) return res.status(429).json({ error: 'Trop de requêtes. Réessayez plus tard.' });
  next();
}, authRouter);

app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/collections', collectionsRouter);
app.use('/api/contact', contactRouter);
app.use('/api/account', require('./routes/account'));
app.use('/api/settings', require('./routes/settings'));

app.get('/api/config', (req, res) => res.json({ googleClientId: process.env.GOOGLE_CLIENT_ID || '' }));

const uploadsDir = path.join(__dirname, '..', 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

app.use(express.static(path.join(__dirname, '..', 'public'), { index: 'index.html' }));

app.use((err, req, res, next) => {
  console.error(err);
  if (res.headersSent) return next(err);
  res.status(500).json({ error: 'Erreur serveur' });
});

async function bootstrapAdmin() {
  const email = String(process.env.ADMIN_EMAIL || process.env.SUPER_ADMIN_EMAIL || '').trim().toLowerCase();
  const password = String(process.env.ADMIN_PASSWORD || '');
  const name = String(process.env.ADMIN_NAME || 'Kolo Admin').trim();
  if (!email || !/^\S+@\S+\.\S+$/.test(email) || password.length < 8) return;
  try {
    const [existing] = await db.query('SELECT id, role FROM users WHERE email = ?', [email]);
    if (existing.length) {
      if (existing[0].role !== 'admin') {
        await db.query("UPDATE users SET role = 'admin' WHERE id = ?", [existing[0].id]);
        console.log(`Admin user [${email}] role ensured as admin.`);
      }
      return;
    }
    const hash = await bcrypt.hash(password, 12);
    const [r] = await db.query('INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)', [name, email, hash, 'admin']);
    console.log(`Admin user [${email}] auto-created with id ${r.insertId}.`);
  } catch (err) {
    console.error('Admin bootstrap notice:', err.message);
  }
}

async function ensureProductImages() {
  try {
    const [prods] = await db.query('SELECT id, name, category, image_url FROM products WHERE image_url IS NULL OR image_url = ""');
    if (prods && prods.length > 0) {
      const defaultImages = {
        1: '/images/products/chemise_1.jpg',
        2: '/images/products/robe_1.jpg',
        3: '/images/products/veste_1.jpg',
        4: '/images/products/tshirt_1.jpg',
        5: '/images/products/sac_1.jpg',
        6: '/images/products/sac_2.jpg',
        7: '/images/products/pochette_1.jpg',
        8: '/images/products/accessoire_phone_1.jpg',
        9: '/images/products/ecouteurs_1.jpg',
        10: '/images/products/accessoire_phone_2.jpg',
        11: '/images/products/smartphone_1.jpg',
        12: '/images/products/lunettes_1.jpg',
        13: '/images/products/montre_1.jpg',
        14: '/images/products/casquette_1.jpg'
      };
      const catFallbacks = {
        shirt: '/images/products/chemise_1.jpg',
        bag: '/images/products/sac_1.jpg',
        phone: '/images/products/smartphone_1.jpg',
        other: '/images/products/montre_1.jpg',
        parfum: '/images/products/parfum_1.jpg',
        chaussures: '/images/products/baskets_1.jpg',
        veste: '/images/products/veste_1.jpg',
        enfants: '/images/products/enfants_1.jpg',
        chaussures_enfants: '/images/products/enfants_chaussures_1.jpg'
      };
      for (const p of prods) {
        const img = defaultImages[p.id] || catFallbacks[p.category] || '/images/products/chemise_1.jpg';
        await db.query('UPDATE products SET image_url = ? WHERE id = ?', [img, p.id]);
      }
      console.log(`Populated default images for ${prods.length} products.`);
    }
  } catch (err) {
    console.error('Product image check notice:', err.message);
  }
}

const PORT = Number(process.env.PORT || 3000);
db.ready
  .then(bootstrapAdmin)
  .then(ensureProductImages)
  .then(() => app.listen(PORT, () => console.log(`Boutique Toumaï: http://localhost:${PORT}`)))
  .catch(err => {
    console.error('Database initialization failed:', err);
    process.exit(1);
  });
