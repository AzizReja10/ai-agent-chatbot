const path = require("node:path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

module.exports = {
  openRouterApiKey: process.env.OPENROUTER_API_KEY,
  groqApiKey: process.env.GROQ_API_KEY,
  slackBotToken: process.env.SLACK_BOT_TOKEN,
  githubOAuthClientId: process.env.GITHUB_OAUTH_CLIENT_ID,
  githubOAuthClientSecret: process.env.GITHUB_OAUTH_CLIENT_SECRET,
  isProduction: process.env.ENVIRONMENT === "production",
  openWeatherApiKey: process.env.OPENWEATHER_API_KEY,
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",
  backendUrl: process.env.BACKEND_URL || "http://127.0.0.1:8000",
  port: Number(process.env.PORT || 8000),
};
