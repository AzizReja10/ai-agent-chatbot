const { createHash, randomBytes } = require("node:crypto");
const { Router } = require("express");
const {
  createSigninHandoff,
  getCurrentUser,
  popOAuthState,
  storeOAuthState,
} = require("./auth");
const { createUser, get, run } = require("./db");
const { backendUrl, frontendUrl } = require("./config");
const { googleClientCredentials, scopes } = require("./tools/google_auth");

const router = Router();
const signInScopes = [
  "openid",
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
];
const connectRedirectUri = `${backendUrl}/auth/google/callback`;
const signinRedirectUri = `${backendUrl}/auth/google/signin/callback`;

function pkceChallenge(verifier) {
  return createHash("sha256").update(verifier).digest("base64url");
}

async function beginGoogleFlow(response, { userId, signin = false }) {
  const client = googleClientCredentials();
  const state = randomBytes(24).toString("base64url");
  const codeVerifier = randomBytes(48).toString("base64url");
  const callbackUri = signin ? signinRedirectUri : connectRedirectUri;
  const scope = signin ? signInScopes : scopes;
  await storeOAuthState(state, { user_id: userId, code_verifier: codeVerifier });

  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.search = new URLSearchParams({
    client_id: client.client_id,
    redirect_uri: callbackUri,
    response_type: "code",
    scope: scope.join(" "),
    state,
    code_challenge: pkceChallenge(codeVerifier),
    code_challenge_method: "S256",
    access_type: "offline",
    prompt: signin ? "select_account" : "consent",
  });
  response.redirect(url.toString());
}

async function exchangeCode(code, state, { signin = false } = {}) {
  const pending = await popOAuthState(state);
  if (!pending) throw new Error(signin ? "Invalid or expired sign-in state" : "Invalid or expired OAuth state");
  if (!signin && !pending.user_id) throw new Error("Invalid OAuth state");
  const client = googleClientCredentials();
  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: client.client_id,
      client_secret: client.client_secret,
      code,
      code_verifier: pending.code_verifier,
      grant_type: "authorization_code",
      redirect_uri: signin ? signinRedirectUri : connectRedirectUri,
    }),
  });
  const tokens = await tokenResponse.json();
  if (!tokenResponse.ok || !tokens.access_token) {
    throw new Error(tokens.error_description || tokens.error || "Google did not return an access token");
  }
  tokens.expiry_date = Date.now() + Number(tokens.expires_in || 3600) * 1000;
  return { pending, tokens };
}

router.get("/auth/google/signin", async (_request, response, next) => {
  try {
    await beginGoogleFlow(response, { signin: true });
  } catch (error) {
    next(error);
  }
});

router.get("/auth/google/login", async (request, response, next) => {
  try {
    const user = await getCurrentUser(request);
    if (!user) return response.status(401).json({ detail: "Not logged in" });
    await beginGoogleFlow(response, { userId: user.id });
  } catch (error) {
    next(error);
  }
});

router.get("/auth/google/callback", async (request, response, next) => {
  try {
    const { code, state, error: oauthError } = request.query;
    if (oauthError) return response.status(400).send(`Google authorization failed: ${oauthError}`);
    if (typeof code !== "string" || typeof state !== "string") {
      return response.status(400).send("Missing Google authorization code or state.");
    }
    const { pending, tokens } = await exchangeCode(code, state);
    await run(
      "INSERT INTO google_credentials (user_id, token_json) VALUES (?, ?) ON CONFLICT(user_id) DO UPDATE SET token_json = excluded.token_json",
      [pending.user_id, JSON.stringify(tokens)],
    );
    return response.redirect(`${frontendUrl}?google_connected=true`);
  } catch (error) {
    next(error);
  }
});

router.get("/auth/google/signin/callback", async (request, response, next) => {
  try {
    const { code, state, error: oauthError } = request.query;
    if (oauthError) return response.status(400).send(`Google authorization failed: ${oauthError}`);
    if (typeof code !== "string" || typeof state !== "string") {
      return response.status(400).send("Missing Google authorization code or state.");
    }
    const { tokens } = await exchangeCode(code, state, { signin: true });
    const userInfoResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    const userInfo = await userInfoResponse.json();
    if (!userInfoResponse.ok || !userInfo.email) {
      return response.status(400).send("Could not retrieve an email from Google");
    }
    let user = await get("SELECT id FROM users WHERE email = ?", [userInfo.email]);
    if (!user) user = await createUser(userInfo.email);
    const handoffToken = await createSigninHandoff(user.id);
    return response.redirect(`${frontendUrl}?signin_token=${encodeURIComponent(handoffToken)}`);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
