const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const db = require('../db');
const { OAuth2Client } = require('google-auth-library');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET || JWT_SECRET.length < 32) throw new Error('JWT_SECRET must be set and contain at least 32 characters.');
const SUPER_ADMIN_EMAIL = (process.env.SUPER_ADMIN_EMAIL || '').trim().toLowerCase();
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

const storage = multer.diskStorage({
  destination: path.join(__dirname, '..', '..', 'public', 'images'),
  filename: (req, file, cb) => cb(null, `avatar_${Date.now()}${path.extname(file.originalname).toLowerCase()}`)
});
const upload = multer({ storage, limits: { fileSize: 2 * 1024 * 1024 }, fileFilter: (req,file,cb) => cb(null, /^image\/(jpeg|png|webp)$/.test(file.mimetype)) });

function normalizeEmail(email) { return String(email || '').trim().toLowerCase(); }
function signToken(user) { return jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }); }

const authMiddleware = async (req,res,next) => {
  const token = req.header('Authorization')?.replace(/^Bearer\s+/i,'');
  if (!token) return res.status(401).json({error:'Accès refusé. Veuillez vous connecter.'});
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const [users] = await db.query('SELECT id,name,email,role,avatar_url FROM users WHERE id = ?', [decoded.id]);
    if (!users.length) return res.status(401).json({error:'Compte introuvable.'});
    req.user = users[0];
    next();
  } catch { return res.status(401).json({error:'Session invalide ou expirée.'}); }
};
const adminMiddleware = (req,res,next) => req.user?.role === 'admin' ? next() : res.status(403).json({error:'Accès administrateur requis.'});

router.post('/register', async (req,res) => {
  try {
    const name=String(req.body.name||'').trim(), email=normalizeEmail(req.body.email), password=String(req.body.password||'');
    if (name.length < 2 || name.length > 150 || !/^\S+@\S+\.\S+$/.test(email) || password.length < 8 || password.length > 128) return res.status(400).json({error:'Nom, email ou mot de passe invalide (8 caractères minimum).'});
    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length) return res.status(409).json({error:'Cet email est déjà utilisé.'});
    const hash=await bcrypt.hash(password,12);
    const [result]=await db.query('INSERT INTO users (name,email,password_hash,role) VALUES (?,?,?,?)',[name,email,hash,'customer']);
    const user={id:result.insertId,name,email,role:'customer',avatar_url:null};
    res.status(201).json({token:signToken(user),user});
  } catch(err) { console.error(err); res.status(500).json({error:'Erreur serveur'}); }
});

router.post('/login', async (req,res) => {
  try {
    const email=normalizeEmail(req.body.email), password=String(req.body.password||'');
    const [users]=await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (!users.length || !(await bcrypt.compare(password,users[0].password_hash))) return res.status(401).json({error:'Email ou mot de passe incorrect.'});
    const user=users[0]; const safe={id:user.id,name:user.name,email:user.email,role:user.role,avatar_url:user.avatar_url};
    res.json({token:signToken(safe),user:safe});
  } catch(err) { console.error(err); res.status(500).json({error:'Erreur serveur'}); }
});

router.post('/google', async (req, res) => {
  try {
    const { token, mockEmail, mockName, mockPassword } = req.body;
    if (!token) return res.status(400).json({error:'Jeton Google manquant.'});
    

    if (!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID.includes('votre_client_id')) return res.status(500).json({error:'Google Login non configuré sur le serveur.'});
    
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const email = normalizeEmail(payload.email);
    const name = payload.name;
    const picture = payload.picture;
    
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    let user;
    if (users.length) {
      user = users[0];
      if (picture && !user.avatar_url) {
        await db.query('UPDATE users SET avatar_url = ? WHERE id = ?', [picture, user.id]);
        user.avatar_url = picture;
      }
    } else {
      // Create a new user with a dummy password hash (since it's NOT NULL in db)
      const dummyHash = await bcrypt.hash(Math.random().toString(), 10);
      const [result] = await db.query('INSERT INTO users (name,email,password_hash,role,avatar_url) VALUES (?,?,?,?,?)',[name,email,dummyHash,'customer',picture]);
      user = { id: result.insertId, name, email, role: 'customer', avatar_url: picture };
    }
    const safe = { id: user.id, name: user.name, email: user.email, role: user.role, avatar_url: user.avatar_url };
    res.json({ token: signToken(safe), user: safe });
  } catch (err) {
    console.error('Google Auth Error:', err);
    res.status(401).json({error:'Authentification Google échouée.'});
  }
});

router.get('/me', authMiddleware, (req,res)=>res.json(req.user));
router.get('/users', authMiddleware, adminMiddleware, async (req,res)=>{ const [users]=await db.query('SELECT id,name,email,role,created_at FROM users ORDER BY created_at DESC'); res.json(users); });
router.post('/users', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const name = String(req.body.name || '').trim();
    const email = normalizeEmail(req.body.email);
    const password = String(req.body.password || '');
    const role = req.body.role === 'admin' ? 'admin' : 'customer';

    if (name.length < 2 || !/^\S+@\S+\.\S+$/.test(email) || password.length < 8) {
      return res.status(400).json({ error: 'Nom (2 car. min), email valide et mot de passe (8 car. min) requis.' });
    }

    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length) {
      return res.status(409).json({ error: 'Cet email est déjà associé à un compte.' });
    }

    const hash = await bcrypt.hash(password, 12);
    const [result] = await db.query('INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)', [name, email, hash, role]);
    
    res.status(201).json({ success: true, user: { id: result.insertId, name, email, role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la création du compte.' });
  }
});
router.delete('/users/:id', authMiddleware, adminMiddleware, async (req,res)=>{
  const id=Number(req.params.id); if (!Number.isInteger(id)) return res.status(400).json({error:'Identifiant invalide.'});
  const [target]=await db.query('SELECT id,email FROM users WHERE id=?',[id]); if(!target.length) return res.status(404).json({error:'Utilisateur introuvable.'});
  if (target[0].email.toLowerCase()===SUPER_ADMIN_EMAIL) return res.status(403).json({error:'Le compte principal ne peut pas être supprimé.'});
  await db.query('DELETE FROM users WHERE id=?',[id]); res.json({success:true});
});
router.put('/users/:id/role', authMiddleware, adminMiddleware, async (req,res)=>{
  const id=Number(req.params.id), role=req.body.role;
  if(!Number.isInteger(id)||!['admin','customer'].includes(role)) return res.status(400).json({error:'Données invalides.'});
  const [target]=await db.query('SELECT email FROM users WHERE id=?',[id]); if(!target.length) return res.status(404).json({error:'Utilisateur introuvable.'});
  if(target[0].email.toLowerCase()===SUPER_ADMIN_EMAIL && role!=='admin') return res.status(403).json({error:'Le compte principal ne peut pas être rétrogradé.'});
  await db.query('UPDATE users SET role=? WHERE id=?',[role,id]); res.json({success:true,role});
});
router.post('/avatar', authMiddleware, upload.single('avatar'), async (req,res)=>{
  if(!req.file) return res.status(400).json({error:'Image invalide. Utilisez JPG, PNG ou WebP (2 Mo max).'});
  const url='/images/'+req.file.filename; await db.query('UPDATE users SET avatar_url=? WHERE id=?',[url,req.user.id]); res.json({success:true,avatar_url:url});
});

router.post('/forgot-password', async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const [users] = await db.query('SELECT id, email FROM users WHERE email = ?', [email]);
    if (!users.length) {
      // Return success even if not found to prevent email enumeration
      return res.json({ success: true, message: 'Si ce compte existe, un email a été envoyé.' });
    }
    
    // Create a reset token valid for 15 minutes
    const token = jwt.sign({ id: users[0].id, reset: true }, JWT_SECRET, { expiresIn: '15m' });
    
    // Return dev link directly for the demo context
    const devResetLink = `http://localhost:${process.env.PORT || 3001}/reset-password.html?token=${token}`;
    res.json({ success: true, devResetLink });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password || password.length < 8) {
      return res.status(400).json({ error: 'Token invalide ou mot de passe trop court.' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
      if (!decoded.reset) throw new Error('Token type invalide');
    } catch(err) {
      return res.status(400).json({ error: 'Le lien est invalide ou a expiré.' });
    }

    const hash = await bcrypt.hash(password, 12);
    await db.query('UPDATE users SET password_hash = ? WHERE id = ?', [hash, decoded.id]);
    
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.post('/change-password', authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword || newPassword.length < 8) {
      return res.status(400).json({ error: 'Nouveau mot de passe invalide (8 caractères minimum).' });
    }
    const [users] = await db.query('SELECT password_hash FROM users WHERE id = ?', [req.user.id]);
    if (!users.length) return res.status(404).json({ error: 'Utilisateur introuvable.' });
    
    if (!(await bcrypt.compare(currentPassword, users[0].password_hash))) {
      return res.status(401).json({ error: 'Le mot de passe actuel est incorrect.' });
    }
    
    const hash = await bcrypt.hash(newPassword, 12);
    await db.query('UPDATE users SET password_hash = ? WHERE id = ?', [hash, req.user.id]);
    res.json({ success: true, message: 'Mot de passe modifié avec succès.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports={router,authMiddleware,adminMiddleware};
