const express = require('express');
const router = express.Router();
const db = require('../db');
const { authMiddleware, adminMiddleware } = require('./auth');

// GET /api/collections → liste des collections avec leurs produits
router.get('/', async (req, res) => {
  try {
    const [collections] = await db.query('SELECT * FROM collections ORDER BY id');
    const [links] = await db.query(
      `SELECT cp.collection_id, p.*
       FROM collection_products cp
       JOIN products p ON p.id = cp.product_id`
    );
    const result = collections.map(c => ({
      ...c,
      products: links.filter(l => l.collection_id === c.id)
    }));
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /api/collections
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { name, name_ar, description } = req.body;
    if (!name) return res.status(400).json({ error: 'Nom manquant' });
    const [r] = await db.query('INSERT INTO collections(name, name_ar, description) VALUES(?,?,?)', [name, name_ar || '', description || '']);
    res.status(201).json({ id: r.insertId, name, name_ar, description });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PUT /api/collections/:id
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { name, name_ar, description } = req.body;
    if (!name) return res.status(400).json({ error: 'Nom manquant' });
    await db.query('UPDATE collections SET name=?, name_ar=?, description=? WHERE id=?', [name, name_ar || '', description || '', req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// DELETE /api/collections/:id
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await db.query('DELETE FROM collection_products WHERE collection_id=?', [req.params.id]);
    await db.query('DELETE FROM collections WHERE id=?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
