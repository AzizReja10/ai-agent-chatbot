# AI Agent Chatbot

A multi-user, multi-tool AI agent chatbot built from scratch with **pure LangChain** — no LangGraph or CrewAI abstractions beyond LangChain's own `create_agent`. The agent connects to Gmail, Google Calendar, Google Tasks, Google Docs, GitHub, Slack, and the web, and can take real actions (sending email, posting to Slack, creating calendar events) on a user's behalf — with a human-in-the-loop safety gate for anything irreversible.

Built as a learning project to understand agent architecture from the ground up: the reason → act → observe loop, tool design, OAuth (single- and multi-user), streaming, and production hardening.

## Features

- **12 tools** across 4 distinct auth patterns:
  - Mock (weather)
  - Static token (GitHub — read; Slack — read + gated send)
  - Per-user OAuth (Google: Gmail read + gated send, Calendar read/write, Tasks read/write, Docs read/append; GitHub read)
  - No-auth (DuckDuckGo web search)
- **Human-in-the-loop safety gate** for irreversible actions (email, Slack messages): the agent can only *draft*, never *send* — a separate code path outside the LLM's reach detects explicit user confirmation and executes the real action.
- **Streaming responses** (Server-Sent Events) with live tool-activity visualization in the UI.
- **Short-term memory** via LangGraph's checkpointer, keyed per user/thread.
- **Full multi-user auth**: email/password signup+login, "Sign in with Google," "Sign in with GitHub," secure sessions, logout.
- **Per-user OAuth connections**: each user connects their own Google and GitHub accounts; the agent acts on *their* data, not the developer's.
- **Production-hardened**: Postgres-backed (not SQLite), database-backed OAuth state (no fragile in-memory dicts), session expiry, environment-aware secure cookies, rate-limited auth endpoints.
- **Polished React frontend**: animated landing page, streaming chat with markdown rendering, a live tool-activity sidebar, and a distinct animated confirmation card for the draft-then-send safety gate — all built with framer-motion.

## Tech Stack

**Backend**: Python, FastAPI, LangChain (`create_agent`), LangGraph (checkpointer), SQLAlchemy, PostgreSQL, bcrypt, slowapi (rate limiting)

**Frontend**: React (Vite), framer-motion, react-markdown

**LLM**: OpenRouter (`nvidia/nemotron-3-ultra-550b-a55b`) — chosen and verified specifically for reliable native tool-calling

**Auth providers**: Google OAuth 2.0 (web flow, PKCE), GitHub OAuth Apps

## Architecture

```
backend/
├── app/
│   ├── main.py                  # FastAPI app, routes, streaming endpoint
│   ├── auth.py                  # sessions, password hashing, OAuth state helpers
│   ├── db.py / models.py        # SQLAlchemy models (User, Session, GoogleCredential,
│   │                               GitHubCredential, OAuthState)
│   ├── user_context.py          # contextvars-based per-request user identity
│   ├── google_oauth_routes.py   # Google connect + sign-in flows
│   ├── github_oauth_routes.py   # GitHub connect + sign-in flows
│   ├── agent/
│   │   ├── agent_factory.py     # builds the LLM + tool list + checkpointer
│   │   └── safe_action_flow.py  # the draft → confirm → send safety gate
│   └── tools/
│       ├── weather_tool.py
│       ├── github_tool.py
│       ├── slack_tool.py
│       ├── web_search_tool.py
│       ├── google_auth.py       # per-user Google credential lookup + refresh
│       ├── tasks_tool.py
│       ├── calendar_tool.py
│       ├── docs_tool.py
│       └── gmail_tool.py
└── requirements.txt

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

- **Safety gate lives outside the LLM's reach.** `send_email` and `send_slack_message` are never included in the agent's tool list — only `draft_email`/`draft_slack_message` are. A separate function (`safe_action_flow.py`) inspects conversation history for a pending draft plus an explicit user confirmation, then calls the real send function directly. This was hardened after discovering the LLM could otherwise hallucinate its own "yes, send it" approval.
- **Per-user identity flows through `contextvars`**, not tool arguments — the LLM never needs to know about user IDs; `current_user_id.set()` at the top of each request makes it transparently available to any tool function, including deep inside credential-lookup helpers.
- **OAuth state (PKCE verifiers, sign-in handoff tokens) is stored in the database**, not in-memory dicts — required for surviving server restarts and multi-worker deployments, and hardened against a race condition where two near-simultaneous requests could both consume the same one-time token.
- **A one-time handoff token bridges OAuth sign-in redirects and the frontend's dev proxy.** Google/GitHub redirect the browser directly to the backend, bypassing Vite's proxy — a cookie set at that point would land on the wrong origin. Instead, the backend redirects with a short-lived token, and the frontend exchanges it via a same-origin, proxied request that correctly sets the session cookie.

## Setup

### Backend
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env  # fill in your own keys
uvicorn app.main:app --reload --reload-exclude "*.db"
```

Required environment variables: `DATABASE_URL`, `OPENROUTER_API_KEY`, `GITHUB_OAUTH_CLIENT_ID`, `GITHUB_OAUTH_CLIENT_SECRET`, `GOOGLE_CREDENTIALS_JSON` (or a local `credentials_web.json`), `ENVIRONMENT`.

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

- Slack and GitHub *read* access uses the developer's own tokens for some legacy tool paths where per-user OAuth wasn't extended; GitHub write/connect is per-user, Slack remains shared by deliberate scope decision.
- `is_confirmation()`'s keyword matching for the safety gate is intentionally simple — the frontend's explicit Send/Cancel buttons are the more robust path.
- Not yet deployed publicly; local/dev-tested against Postgres with production-hardening applied (session expiry, rate limiting, secure cookies, DB-backed OAuth state).

## What this project demonstrates

Built iteratively with an emphasis on understanding *why*, not just *what*: the LLM tool-calling loop from first principles, real OAuth debugging (PKCE, redirect URI mismatches, cross-origin cookies), a from-scratch multi-user auth system, and a deliberate safety architecture for an agent that can take real-world actions.