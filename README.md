# AI Agent Chatbot

A multi-user, multi-tool AI agent chatbot with a Node.js/Express backend. The agent connects to Gmail, Google Calendar, Google Tasks, Google Docs, GitHub, Slack, and the web, and can take real actions (sending email, posting to Slack, creating calendar events) on a user's behalf — with a human-in-the-loop safety gate for anything irreversible.

Built as a learning project to understand agent architecture from the ground up: the reason → act → observe loop, tool design, OAuth (single- and multi-user), streaming, and production hardening.
Live Link : https://ai-agent-chatbot-tan.vercel.app/
## Features

- **Tools** across distinct auth patterns:
  - API key (live weather)
  - Per-user OAuth (GitHub read; Google Gmail, Calendar, Tasks, and Docs)
  - Bot token (Slack — read + gated send)
  - No-auth (DuckDuckGo web search)
- **Human-in-the-loop safety gate** for irreversible actions (email, Slack messages): the agent can only *draft*, never *send* — a separate code path outside the LLM's reach detects explicit user confirmation and executes the real action.
- **Streaming responses** (Server-Sent Events) with live tool-activity visualization in the UI.
- **Short-term conversation memory** keyed per user, held in process memory.
- **Full multi-user auth**: email/password signup+login, "Sign in with Google," "Sign in with GitHub," secure sessions, logout.
- **Per-user OAuth connections**: each user connects their own Google and GitHub accounts; the agent acts on *their* data, not the developer's.
- **Production-hardened**: SQLite or PostgreSQL, database-backed OAuth state (no fragile in-memory dicts), session expiry, environment-aware secure cookies, rate-limited auth endpoints.
- **Polished React frontend**: animated landing page, streaming chat with markdown rendering, a live tool-activity sidebar, and a distinct animated confirmation card for the draft-then-send safety gate — all built with framer-motion.

## Tech Stack

**Backend**: Node.js, Express, OpenAI-compatible tool calling, SQLite or PostgreSQL, bcryptjs, express-rate-limit

**Frontend**: React (Vite), framer-motion, react-markdown

**LLM**: Groq or OpenRouter through an OpenAI-compatible streaming API

**Auth providers**: Google OAuth 2.0 (web flow, PKCE), GitHub OAuth Apps

## Architecture

```
backend/
├── app/
│   ├── main.js                  # Express app, routes, streaming endpoint
│   ├── auth.js                  # sessions, password hashing, OAuth state helpers
│   ├── db.js / models.js        # database access (User, Session, GoogleCredential,
│   │                               GitHubCredential, OAuthState)
│   ├── user_context.js          # AsyncLocalStorage per-request user identity
│   ├── google_oauth_routes.js   # Google connect + sign-in flows
│   ├── github_oauth_routes.js  # GitHub connect + sign-in flows
│   ├── agent/
│   │   ├── agent_factory.js     # streams model responses and dispatches tools
│   │   └── safe_action_flow.js  # the draft → confirm → send safety gate
│   └── tools/
│       ├── weather_tool.js
│       ├── github_tool.js
│       ├── slack_tool.js
│       ├── web_search_tool.js
│       ├── google_auth.js       # per-user Google credential lookup + refresh
│       ├── tasks_tool.js
│       ├── calender_tool.js
│       ├── docs_tool.js
│       └── gmail_tool.js
└── tests/                       # Node.js backend tests

frontend/
└── src/
    ├── App.jsx
    ├── api/                     # chat.js (SSE streaming), auth.js
    ├── pages/LandingPage.jsx
    └── components/
        ├── ChatWindow.jsx / MessageBubble.jsx / MessageInput.jsx
        ├── ToolActivitySidebar.jsx
        ├── ConfirmationCard.jsx
        ├── AuthForm.jsx
        ├── TypingIndicator.jsx
        └── landing/ (FloatingIcon.jsx, LogoMarquee.jsx)
```

### Key design decisions

- **Safety gate lives outside the LLM's reach.** `send_email` and `send_slack_message` are never included in the agent's tool list — only `draft_email`/`draft_slack_message` are. A separate function (`safe_action_flow.js`) inspects conversation history for a pending draft plus an explicit user confirmation, then calls the real send function directly.
- **Per-user identity flows through `AsyncLocalStorage`**, not tool arguments — the LLM never needs to know about user IDs; request context makes identity available to tool functions and credential helpers.
- **OAuth state (PKCE verifiers, sign-in handoff tokens) is stored in the database**, not in-memory dicts, and is consumed once with a ten-minute lifetime.
- **A one-time handoff token bridges OAuth sign-in redirects and the frontend's dev proxy.** Google/GitHub redirect the browser directly to the backend, bypassing Vite's proxy — a cookie set at that point would land on the wrong origin. Instead, the backend redirects with a short-lived token, and the frontend exchanges it via a same-origin, proxied request that correctly sets the session cookie.

## Setup

### Backend
```bash
npm ci --prefix backend
npm run backend
```

Required environment variables: `GROQ_API_KEY` (or `OPENROUTER_API_KEY`), `GITHUB_OAUTH_CLIENT_ID`, `GITHUB_OAUTH_CLIENT_SECRET`, `GOOGLE_CREDENTIALS_JSON` (or `backend/credentials_web.json`), and optionally `DATABASE_URL`, `OPENWEATHER_API_KEY`, `SLACK_BOT_TOKEN`, `ENVIRONMENT`, `FRONTEND_URL`, and `BACKEND_URL`. The default database is the existing `backend/app.db`; PostgreSQL URLs are also supported.

Run backend tests with `npm run test:backend`.

### Render deployment
Deploy from the repository root with the included `render.yaml`, or update the existing Render web service settings to:
- **Runtime:** Node
- **Root Directory:** leave blank (repository root)
- **Build Command:** `npm install`
- **Start Command:** `npm run backend`
- **Health Check Path:** `/health`

The service also needs the environment variables listed above (especially `GROQ_API_KEY` or `OPENROUTER_API_KEY`). If using PostgreSQL, set `DATABASE_URL` to the Render database connection string.

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Google/GitHub OAuth setup
- Google Cloud Console: create a **Web application** OAuth client with redirect URIs for `/auth/google/callback` and `/auth/google/signin/callback`. Enable the Tasks, Calendar, Docs, Drive, and Gmail APIs.
- GitHub: create an OAuth App with a single callback URL (`/auth/github/callback`) — GitHub only supports one, so connect and sign-in flows are distinguished via the OAuth `state` parameter.

## Known limitations

- Slack access uses the configured shared bot token; GitHub and Google access use per-user OAuth credentials.
- Confirmation text is intentionally limited to explicit affirmative phrases; the frontend's Send/Cancel controls provide the clearest path.
- Not yet deployed publicly; configure `DATABASE_URL` with a PostgreSQL connection string for production. SQLite remains the local default.

## What this project demonstrates

Built iteratively with an emphasis on understanding *why*, not just *what*: the LLM tool-calling loop from first principles, real OAuth debugging (PKCE, redirect URI mismatches, cross-origin cookies), a from-scratch multi-user auth system, and a deliberate safety architecture for an agent that can take real-world actions.
