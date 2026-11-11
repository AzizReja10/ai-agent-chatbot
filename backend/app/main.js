require("./config");
const express = require("express");
const cookieParser = require("cookie-parser");
const { rateLimit } = require("express-rate-limit");
const { userContext } = require("./user_context");
const {
  createSession,
  getCurrentUser,
  hashPassword,
  popOAuthState,
  SESSION_LIFETIME_MS,
  verifyPassword,
} = require("./auth");
const { createUser, get, initializeDatabase, run } = require("./db");
const { isProduction, port } = require("./config");
const { buildAgent } = require("./agent/agent_factory");
const googleOAuthRouter = require("./google_oauth_routes");
const githubOAuthRouter = require("./github_oauth_routes");

const app = express();
const agent = buildAgent();
const allowedOrigins = new Set([
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://ai-agent-chatbot-tan.vercel.app",
  ...(process.env.CORS_ORIGINS || "").split(",").map((origin) => origin.trim()).filter(Boolean),
]);

app.set("trust proxy", isProduction ? 1 : false);
app.use((request, response, next) => {
  const origin = request.get("origin");
  if (origin && allowedOrigins.has(origin)) {
    response.setHeader("Access-Control-Allow-Origin", origin);
    response.setHeader("Access-Control-Allow-Credentials", "true");
    response.setHeader("Vary", "Origin");
    response.setHeader("Access-Control-Allow-Headers", "Content-Type");
    response.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  }
  if (request.method === "OPTIONS") return response.sendStatus(204);
  return next();
});
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

const authRateLimit = rateLimit({
  windowMs: 60_000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { detail: "Too many requests. Please try again later." },
});
const finalizeRateLimit = rateLimit({
  windowMs: 60_000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { detail: "Too many requests. Please try again later." },
});

function setSessionCookie(response, sessionId) {
  response.cookie("session_id", sessionId, {
    httpOnly: true,
    sameSite: "lax",
    secure: isProduction,
    maxAge: SESSION_LIFETIME_MS,
    path: "/",
  });
}

function validCredentials(request, response) {
  const { email, password } = request.body || {};
  if (
    typeof email !== "string" ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    typeof password !== "string" ||
    !password
  ) {
    response.status(422).json({ detail: "A valid email and password are required." });
    return null;
  }
  return { email: email.trim(), password };
}

app.post("/auth/signup", authRateLimit, async (request, response, next) => {
  try {
    const credentials = validCredentials(request, response);
    if (!credentials) return;
    if (await get("SELECT id FROM users WHERE email = ?", [credentials.email])) {
      return response.status(400).json({ detail: "Email already registered" });
    }
    const user = await createUser(credentials.email, await hashPassword(credentials.password));
    const sessionId = await createSession(user.id);
    setSessionCookie(response, sessionId);
    return response.json({ email: user.email });
  } catch (error) {
    if (error.code === "SQLITE_CONSTRAINT_UNIQUE" || error.code === "23505") {
      return response.status(400).json({ detail: "Email already registered" });
    }
    return next(error);
  }
});

app.post("/auth/login", authRateLimit, async (request, response, next) => {
  try {
    const credentials = validCredentials(request, response);
    if (!credentials) return;
    const user = await get("SELECT id, email, hashed_password FROM users WHERE email = ?", [
      credentials.email,
    ]);
    if (!user || !(await verifyPassword(credentials.password, user.hashed_password))) {
      return response.status(401).json({ detail: "Invalid email or password" });
    }
    const sessionId = await createSession(user.id);
    setSessionCookie(response, sessionId);
    return response.json({ email: user.email });
  } catch (error) {
    return next(error);
  }
});

app.post("/auth/logout", async (request, response, next) => {
  try {
    if (request.cookies.session_id) {
      await run("DELETE FROM sessions WHERE id = ?", [request.cookies.session_id]);
    }
    response.clearCookie("session_id", { httpOnly: true, sameSite: "lax", secure: isProduction, path: "/" });
    return response.json({ logged_out: true });
  } catch (error) {
    return next(error);
  }
});

app.get("/auth/me", async (request, response, next) => {
  try {
    const user = await getCurrentUser(request);
    if (!user) return response.status(401).json({ detail: "Not logged in" });
    return response.json({ id: user.id, email: user.email });
  } catch (error) {
    return next(error);
  }
});

app.post(["/auth/finalize", "/auth/google/finalize"], finalizeRateLimit, async (request, response, next) => {
  try {
    const token = request.query.token || request.body?.token;
    if (typeof token !== "string" || !token) {
      return response.status(422).json({ detail: "A sign-in token is required." });
    }
    const payload = await popOAuthState(token);
    if (!payload?.user_id) {
      return response.status(400).json({ detail: "Invalid or expired sign-in token" });
    }
    const sessionId = await createSession(payload.user_id);
    setSessionCookie(response, sessionId);
    return response.json({ ok: true });
  } catch (error) {
    return next(error);
  }
});

async function connectionStatus(tableName, request, response, next) {
  try {
    const user = await getCurrentUser(request);
    if (!user) return response.status(401).json({ detail: "Not logged in" });
    const record = await get(`SELECT id FROM ${tableName} WHERE user_id = ?`, [user.id]);
    return response.json({ connected: Boolean(record) });
  } catch (error) {
    return next(error);
  }
}

app.get("/auth/google/status", (request, response, next) =>
  connectionStatus("google_credentials", request, response, next));
app.get("/auth/github/status", (request, response, next) =>
  connectionStatus("github_credentials", request, response, next));
app.use(googleOAuthRouter);
app.use(githubOAuthRouter);

app.post("/chat/cancel", async (request, response, next) => {
  try {
    const user = await getCurrentUser(request);
    if (!user) return response.status(401).json({ detail: "Not logged in" });
    const cancelled = agent.cancelPendingAction(`user-${user.id}`);
    return response.json({ cancelled });
  } catch (error) {
    return next(error);
  }
});

app.post("/chat/stream", async (request, response, next) => {
  try {
    const user = await getCurrentUser(request);
    if (!user) return response.status(401).json({ detail: "Not logged in" });
    if (typeof request.body?.message !== "string" || !request.body.message.trim()) {
      return response.status(422).json({ detail: "A message is required." });
    }
    const threadId = `user-${user.id}`;
    response.status(200);
    response.setHeader("Content-Type", "text/event-stream; charset=utf-8");
    response.setHeader("Cache-Control", "no-cache, no-transform");
    response.setHeader("Connection", "keep-alive");
    response.flushHeaders();
    const sendEvent = (event) => {
      if (!response.destroyed) response.write(`data: ${JSON.stringify(event)}\n\n`);
    };
    try {
      await userContext.run({ userId: user.id }, () =>
        agent.runAgentStream(threadId, request.body.message, sendEvent));
    } catch (error) {
      sendEvent({ type: "error", message: error.message });
      if (!response.destroyed) response.end();
    }
    return undefined;
  } catch (error) {
    return next(error);
  }
});

app.post("/chat", async (request, response, next) => {
  try {
    const user = await getCurrentUser(request);
    if (!user) return response.status(401).json({ detail: "Not logged in" });
    if (typeof request.body?.message !== "string" || !request.body.message.trim()) {
      return response.status(422).json({ detail: "A message is required." });
    }
    const reply = await userContext.run({ userId: user.id }, () =>
      agent.runAgentTurn(`user-${user.id}`, request.body.message));
    return response.json({ reply });
  } catch (error) {
    return next(error);
  }
});

app.get("/health", (_request, response) => response.json({ status: "ok" }));

app.use((error, _request, response, _next) => {
  console.error(error);
  if (response.headersSent) return response.end();
  return response.status(500).json({ detail: "Internal server error" });
});

async function startServer() {
  await initializeDatabase();
  return app.listen(port, () => {
    console.log(`Node backend listening on port ${port}`);
  });
}

if (require.main === module) {
  startServer().catch((error) => {
    console.error("Failed to start backend:", error);
    process.exitCode = 1;
  });
}

module.exports = { app, startServer };
