const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const path = require('path');
const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

const password = "Mast@9880'''";
bcrypt.hash(password, 12).then(hash => {
  db.run('UPDATE users SET password_hash = ? WHERE email = ?', [hash, 'benfadaulmoustapha@gmail.com'], (err) => {
    if (err) console.error(err);
    else console.log('Password updated successfully');
  });
});
