const bcrypt = require('bcrypt');
const db = require('./db');

async function main() {
  const email = String(process.env.ADMIN_EMAIL || '').trim().toLowerCase();
  const password = String(process.env.ADMIN_PASSWORD || '');
  const name = String(process.env.ADMIN_NAME || 'Kolo Admin').trim();
  if (!email || !/^\S+@\S+\.\S+$/.test(email) || password.length < 8) throw new Error('Set ADMIN_EMAIL and ADMIN_PASSWORD (8+ characters).');
  const [existing] = await db.query('SELECT id FROM users WHERE email=?',[email]);
  if(existing.length){ console.log('Admin already exists.'); return; }
  const hash=await bcrypt.hash(password,12);
  const [r]=await db.query('INSERT INTO users(name,email,password_hash,role) VALUES(?,?,?,?)',[name,email,hash,'admin']);
  console.log(`Admin created with id ${r.insertId}.`);
}
main().catch(err=>{console.error(err);process.exitCode=1;});
