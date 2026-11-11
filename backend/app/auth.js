const { randomBytes } = require("node:crypto");
const bcrypt = require("bcryptjs");
const { get, run } = require("./db");

const SESSION_LIFETIME_MS = 7 * 24 * 60 * 60 * 1000;

async function hashPassword(password) {
  return bcrypt.hash(password.slice(0, 72), 12);
}

async function verifyPassword(password, hashed) {
  if (!hashed) return false;
  return bcrypt.compare(password.slice(0, 72), hashed);
}

async function createSession(userId) {
  const sessionId = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_LIFETIME_MS).toISOString();
  await run("INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)", [
    sessionId,
    userId,
    expiresAt,
  ]);
  return sessionId;
}

async function getCurrentUser(request) {
  const sessionId = request.cookies?.session_id;
  if (!sessionId) return null;

  const session = await get(
    "SELECT user_id, expires_at FROM sessions WHERE id = ?",
    [sessionId],
  );
  if (!session) return null;

  if (new Date(session.expires_at).getTime() <= Date.now()) {
    await run("DELETE FROM sessions WHERE id = ?", [sessionId]);
    return null;
  }
  return get("SELECT id, email, hashed_password FROM users WHERE id = ?", [session.user_id]);
}

async function storeOAuthState(key, payload) {
  await run(
    "INSERT INTO oauth_states (id, payload_json, created_at) VALUES (?, ?, ?) ON CONFLICT(id) DO UPDATE SET payload_json = excluded.payload_json, created_at = excluded.created_at",
    [key, JSON.stringify(payload), new Date().toISOString()],
  );
}

async function popOAuthState(key) {
  const state = await get(
    "DELETE FROM oauth_states WHERE id = ? AND created_at >= ? RETURNING payload_json",
    [key, new Date(Date.now() - 10 * 60 * 1000).toISOString()],
  );
  if (!state) return null;
  return JSON.parse(state.payload_json);
}

async function createSigninHandoff(userId) {
  const token = randomBytes(24).toString("base64url");
  await storeOAuthState(token, { user_id: userId });
  return token;
}

module.exports = {
  createSession,
  createSigninHandoff,
  getCurrentUser,
  hashPassword,
  popOAuthState,
  SESSION_LIFETIME_MS,
  storeOAuthState,
  verifyPassword,
};
