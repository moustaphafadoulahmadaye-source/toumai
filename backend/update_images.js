const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.sqlite');
db.serialize(() => {
  db.run("UPDATE products SET image_url = 'https://picsum.photos/400/500?random=' || id WHERE image_url IS NULL OR image_url = ''", function(err) {
    if (err) {
      console.error(err);
    } else {
      console.log(`Updated ${this.changes} products with placeholder images.`);
    }
  });
});
