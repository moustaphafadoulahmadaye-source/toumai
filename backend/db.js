const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'database.sqlite');
const schemaPath = path.join(__dirname, 'schema.sql');

const dbWrapper = {
  db: null,
  ready: null,
  async init() {
    this.db = await open({ filename: dbPath, driver: sqlite3.Database });
    await this.db.exec('PRAGMA foreign_keys = ON;');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    await this.db.exec(schemaSql);
    await this.migrate();
  },
  async migrate() {
    const migrations = [
      ['products', 'admin_id', 'INTEGER'],
      ['orders', 'delivery_date', 'TEXT'],
      ['order_items', 'size', 'TEXT'],
      ['products', 'is_wholesale', 'INTEGER DEFAULT 0'],
      ['products', 'wholesale_discount', 'INTEGER DEFAULT 0']
    ];
    for (const [table, column, type] of migrations) {
      const cols = await this.db.all(`PRAGMA table_info(${table})`);
      if (!cols.some(c => c.name === column)) await this.db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${type}`);
    }
  },
  async query(sql, params = []) {
    await this.ready;
    const normalized = sql.trim().toUpperCase();
    if (normalized.startsWith('SELECT') || normalized.startsWith('PRAGMA')) {
      return [await this.db.all(sql, params)];
    }
    const result = await this.db.run(sql, params);
    return [{ insertId: result.lastID, affectedRows: result.changes }];
  },
  async transaction(fn) {
    await this.ready;
    await this.db.exec('BEGIN IMMEDIATE');
    try { const value = await fn(this.db); await this.db.exec('COMMIT'); return value; }
    catch (err) { try { await this.db.exec('ROLLBACK'); } catch {} throw err; }
  }
};

dbWrapper.ready = dbWrapper.init().catch(err => { console.error('Database initialization failed:', err); process.exit(1); });
module.exports = dbWrapper;
