const fs = require("node:fs");
const path = require("node:path");
const { currentUserId } = require("../user_context");
const { get, run } = require("../db");

const scopes = [
  "https://www.googleapis.com/auth/tasks",
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/documents",
  "https://www.googleapis.com/auth/drive",
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/gmail.send",
];

class GoogleNotConnectedError extends Error {}

function googleClientCredentials() {
  const raw = process.env.GOOGLE_CREDENTIALS_JSON;
  const credentialsPath = path.resolve(__dirname, "../../credentials_web.json");
  let credentials;
  if (raw) {
    credentials = JSON.parse(raw);
  } else if (fs.existsSync(credentialsPath)) {
    credentials = JSON.parse(fs.readFileSync(credentialsPath, "utf8"));
  } else {
    throw new Error(
      "Neither backend/credentials_web.json nor GOOGLE_CREDENTIALS_JSON is available",
    );
  }
  const client = credentials.web || credentials.installed || credentials;
  if (!client.client_id || !client.client_secret) {
    throw new Error("Google OAuth client_id and client_secret are required");
  }
  return client;
}

async function getGoogleAccessToken() {
  const userId = currentUserId();
  const record = await get(
    "SELECT token_json FROM google_credentials WHERE user_id = ?",
    [userId],
  );
  if (!record) {
    throw new GoogleNotConnectedError(
      "You haven't connected your Google account yet. Please connect it to use this feature.",
    );
  }

  const tokens = JSON.parse(record.token_json);
  const expiresAt = Number(tokens.expiry_date || tokens.expires_at || 0);
  if (tokens.access_token && (!expiresAt || expiresAt > Date.now() + 60_000)) {
    return tokens.access_token;
  }
  if (!tokens.refresh_token) {
    throw new GoogleNotConnectedError(
      "Your Google authorization has expired. Please reconnect your Google account.",
    );
  }

  const client = googleClientCredentials();
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: client.client_id,
      client_secret: client.client_secret,
      refresh_token: tokens.refresh_token,
      grant_type: "refresh_token",
    }),
  });
  const refreshed = await response.json();
  if (!response.ok) {
    throw new Error(
      `Google token refresh failed (${refreshed.error_description || refreshed.error || response.status}). Reconnect Google from the app and grant access again.`,
    );
  }

  const updatedTokens = {
    ...tokens,
    ...refreshed,
    refresh_token: refreshed.refresh_token || tokens.refresh_token,
    expiry_date: Date.now() + Number(refreshed.expires_in || 3600) * 1000,
  };
  await run("UPDATE google_credentials SET token_json = ? WHERE user_id = ?", [
    JSON.stringify(updatedTokens),
    userId,
  ]);
  return updatedTokens.access_token;
}

async function googleApi(url, options = {}) {
  const accessToken = await getGoogleAccessToken();
  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error?.message || `Google API returned ${response.status}`);
  }
  return data;
}

module.exports = {
  GoogleNotConnectedError,
  googleApi,
  googleClientCredentials,
  scopes,
};
