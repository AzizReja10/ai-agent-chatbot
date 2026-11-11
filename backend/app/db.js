const path = require("node:path");
require("./config");

const databaseUrl = process.env.DATABASE_URL || "";
const isPostgres = /^postgres(?:ql)?:\/\//i.test(databaseUrl);
let sqlite;
let postgres;

if (isPostgres) {
  const { Pool } = require("pg");
  postgres = new Pool({ connectionString: databaseUrl });
} else {
  const Database = require("better-sqlite3");
  const filename = databaseUrl.startsWith("sqlite:///")
    ? databaseUrl.slice("sqlite:///".length)
    : path.resolve(__dirname, "../app.db");
  sqlite = new Database(path.isAbsolute(filename) ? filename : path.resolve(process.cwd(), filename));
  sqlite.pragma("foreign_keys = ON");
}

function prepareSql(sql) {
  let index = 0;
  return sql.replace(/\?/g, () => `$${++index}`);
}

async function run(sql, params = []) {
  if (isPostgres) {
    const result = await postgres.query(prepareSql(sql), params);
    return { changes: result.rowCount, rows: result.rows };
  }
  const result = sqlite.prepare(sql).run(...params);
  return { changes: result.changes, lastInsertRowid: result.lastInsertRowid };
}

async function get(sql, params = []) {
  if (isPostgres) {
    const result = await postgres.query(prepareSql(sql), params);
    return result.rows[0] || null;
  }
  return sqlite.prepare(sql).get(...params) || null;
}

async function all(sql, params = []) {
  if (isPostgres) {
    const result = await postgres.query(prepareSql(sql), params);
    return result.rows;
  }
  return sqlite.prepare(sql).all(...params);
}

async function initializeDatabase() {
  if (isPostgres) {
    await postgres.query(`
      CREATE TABLE IF NOT EXISTS users (
        id BIGSERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        hashed_password TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        user_id BIGINT NOT NULL REFERENCES users(id),
        created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMPTZ NOT NULL
      );
      CREATE TABLE IF NOT EXISTS google_credentials (
        id BIGSERIAL PRIMARY KEY,
        user_id BIGINT UNIQUE NOT NULL REFERENCES users(id),
        token_json TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS github_credentials (
        id BIGSERIAL PRIMARY KEY,
        user_id BIGINT UNIQUE NOT NULL REFERENCES users(id),
        access_token TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS oauth_states (
        id TEXT PRIMARY KEY,
        payload_json TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
    return;
  }

  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      hashed_password TEXT,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id),
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      expires_at DATETIME NOT NULL
    );
    CREATE TABLE IF NOT EXISTS google_credentials (
      id INTEGER PRIMARY KEY,
      user_id INTEGER UNIQUE NOT NULL REFERENCES users(id),
      token_json TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS github_credentials (
      id INTEGER PRIMARY KEY,
      user_id INTEGER UNIQUE NOT NULL REFERENCES users(id),
      access_token TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS oauth_states (
      id TEXT PRIMARY KEY,
      payload_json TEXT NOT NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

async function createUser(email, passwordHash = null) {
  if (isPostgres) {
    const result = await run(
      "INSERT INTO users (email, hashed_password) VALUES (?, ?) RETURNING id, email",
      [email, passwordHash],
    );
    return result.rows[0];
  }
  const result = await run("INSERT INTO users (email, hashed_password) VALUES (?, ?)", [
    email,
    passwordHash,
  ]);
  return get("SELECT id, email FROM users WHERE id = ?", [result.lastInsertRowid]);
}

async function closeDatabase() {
  if (postgres) await postgres.end();
  if (sqlite) sqlite.close();
}

module.exports = {
  all,
  closeDatabase,
  createUser,
  get,
  initializeDatabase,
  isPostgres,
  run,
};
