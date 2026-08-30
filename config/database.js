const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config();

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: process.env.DB_STORAGE || path.join(__dirname, '..', 'database.sqlite'),
  logging: false,
  define: {
    // Use snake_case column names automatically
    underscored: true,
    timestamps: true,
  },
  // SQLite only supports one writer at a time. Sequelize's default pool can
  // open several connections concurrently, and two of them trying to write
  // at once is exactly what produces "SQLITE_BUSY: database is locked".
  // Capping the pool at a single connection serializes all queries through
  // it, which avoids that class of error entirely for a single-process app.
  pool: {
    max: 1,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  // Belt-and-braces: if a write is ever attempted while SQLite is briefly
  // busy (e.g. an OS-level file lock from another process), retry a few
  // times instead of failing the request immediately.
  retry: {
    match: [/SQLITE_BUSY/],
    max: 5,
  },
});

// Ask SQLite itself to wait (rather than fail immediately) if the database
// file is locked, and switch to WAL journal mode, which allows readers and
// a writer to work concurrently instead of blocking each other.
sequelize.afterConnect(async (connection) => {
  const run = (sql) =>
    new Promise((resolve, reject) => {
      connection.run(sql, (err) => (err ? reject(err) : resolve()));
    });
  await run('PRAGMA busy_timeout = 5000;');
  await run('PRAGMA journal_mode = WAL;');
});

module.exports = sequelize;