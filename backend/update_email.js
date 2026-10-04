const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const db = new sqlite3.Database(path.join(__dirname, 'database.sqlite'));

db.run(
  "UPDATE users SET email = 'abdelmountalibhassan0@gmail.com' WHERE email = 'benfadaulmoustapha@gmail.com'",
  function(err) {
    if (err) console.error(err);
    else console.log(`Email updated. Rows affected: ${this.changes}`);
  }
);
