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

const PORT = Number(process.env.PORT || 3000);
db.ready
  .then(bootstrapAdmin)
  .then(() => app.listen(PORT, () => console.log(`Boutique Toumaï: http://localhost:${PORT}`)))
  .catch(err => {
    console.error('Database initialization failed:', err);
    process.exit(1);
  });
