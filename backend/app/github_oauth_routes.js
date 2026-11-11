const { randomBytes } = require("node:crypto");
const { Router } = require("express");
const {
  createSigninHandoff,
  getCurrentUser,
  popOAuthState,
  storeOAuthState,
} = require("./auth");
const { createUser, get, run } = require("./db");
const { backendUrl, frontendUrl, githubOAuthClientId, githubOAuthClientSecret } = require("./config");

const router = Router();
const redirectUri = `${backendUrl}/auth/github/callback`;
const githubSignInScopes = ["read:user", "user:email", "repo"];

function requireGithubConfig() {
  if (!githubOAuthClientId || !githubOAuthClientSecret) {
    throw new Error("GitHub OAuth is not configured.");
  }
}

router.get("/auth/github/signin", async (_request, response, next) => {
  try {
    requireGithubConfig();
    const state = randomBytes(24).toString("base64url");
    await storeOAuthState(state, { mode: "signin" });
    const url = new URL("https://github.com/login/oauth/authorize");
    url.search = new URLSearchParams({
      client_id: githubOAuthClientId,
      redirect_uri: redirectUri,
      scope: githubSignInScopes.join(" "),
      state,
    });
    response.redirect(url.toString());
  } catch (error) {
    next(error);
  }
});

router.get("/auth/github/login", async (request, response, next) => {
  try {
    requireGithubConfig();
    const user = await getCurrentUser(request);
    if (!user) return response.status(401).json({ detail: "Not logged in" });
    const state = randomBytes(24).toString("base64url");
    await storeOAuthState(state, { mode: "connect", user_id: user.id });
    const url = new URL("https://github.com/login/oauth/authorize");
    url.search = new URLSearchParams({
      client_id: githubOAuthClientId,
      redirect_uri: redirectUri,
      scope: githubSignInScopes.join(" "),
      state,
    });
    response.redirect(url.toString());
  } catch (error) {
    next(error);
  }
});

router.get("/auth/github/callback", async (request, response, next) => {
  try {
    requireGithubConfig();
    const { code, state, error: oauthError } = request.query;
    if (oauthError) return response.status(400).send(`GitHub authorization failed: ${oauthError}`);
    if (typeof code !== "string" || typeof state !== "string") {
      return response.status(400).send("Missing GitHub authorization code or state.");
    }
    const pending = await popOAuthState(state);
    if (!pending) return response.status(400).send("Invalid or expired OAuth state");

    const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: githubOAuthClientId,
        client_secret: githubOAuthClientSecret,
        code,
        redirect_uri: redirectUri,
      }),
    });
    const tokenData = await tokenResponse.json();
    if (!tokenResponse.ok || !tokenData.access_token) {
      return response.status(400).send("GitHub did not return an access token");
    }

    if (pending.mode === "connect") {
      await run(
        "INSERT INTO github_credentials (user_id, access_token) VALUES (?, ?) ON CONFLICT(user_id) DO UPDATE SET access_token = excluded.access_token",
        [pending.user_id, tokenData.access_token],
      );
      return response.redirect(`${frontendUrl}?github_connected=true`);
    }

    const emailResponse = await fetch("https://api.github.com/user/emails", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        Accept: "application/vnd.github+json",
      },
    });
    if (!emailResponse.ok) return response.status(400).send("Could not retrieve a verified email from GitHub");
    const emails = await emailResponse.json();
    const primaryEmail = emails.find((item) => item.primary && item.verified)?.email;
    if (!primaryEmail) {
      return response.status(400).send("Could not retrieve a verified email from GitHub");
    }
    let user = await get("SELECT id FROM users WHERE email = ?", [primaryEmail]);
    if (!user) user = await createUser(primaryEmail);
    await run(
      "INSERT INTO github_credentials (user_id, access_token) VALUES (?, ?) ON CONFLICT(user_id) DO UPDATE SET access_token = excluded.access_token",
      [user.id, tokenData.access_token],
    );
    const handoffToken = await createSigninHandoff(user.id);
    return response.redirect(`${frontendUrl}?signin_token=${encodeURIComponent(handoffToken)}`);
  } catch (error) {
    next(error);
  }
});

router.signInScopes = githubSignInScopes;
module.exports = router;
