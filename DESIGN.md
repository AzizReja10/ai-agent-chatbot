# DESIGN.md

## Overview
This repository implements a **Node.js backend** for an AI agent chatbot. It provides authentication endpoints, session management, and a streaming chat API that forwards user messages to a configurable language model (OpenRouter, Groq, etc.). The architecture is intentionally **modular and lightweight**, focusing on fast request handling and clear separation of concerns.

## Architecture
- **Express** is used as the HTTP server (v5). All routes are defined in `app/`.
- **Authentication** (`auth.js`) handles email/password sign‑up, login, cookie‑based sessions, and OAuth handoffs.
- **Database** (`db.js`) uses **better‑sqlite3** for a simple, zero‑configuration relational store.
- **Agent** (`agent/agent_factory.js`) builds an LLM‑driven agent that streams responses via Server‑Sent Events (SSE).
- **Configuration** (`config.js`) reads required API keys and URLs from environment variables defined in `.env.example`.
- **Rate limiting** protects auth endpoints.
- **GitHub OAuth** routes are intentionally disabled (commented out) per the earlier request, keeping the codebase functional without external OAuth dependencies.

## Why This Design?
1. **Performance** – Using `better-sqlite3` offers synchronous, high‑throughput DB access without the overhead of an async ORM.
2. **Simplicity** – A single Express app with clearly scoped modules reduces cognitive load, making it easy to audit and extend.
3. **Fast Iteration** – The `npm run dev` script starts the server directly with Node, avoiding extra tooling; developers can attach a debugger or use nodemon locally if desired.
4. **Extensibility** – Model providers are abstracted via `config.js`; swapping between OpenRouter, Groq, or others requires only updating an environment variable.
5. **Security** – Sessions are stored in HTTP‑only cookies, passwords are hashed with bcryptjs, and rate limiting prevents brute‑force attacks.

## Alternatives Considered & Rejected
| Alternative | Reason for Rejection |
|------------|----------------------|
| **TypeScript** | Adds compile step; not required for the minimal MVP and would complicate rapid prototyping.
| **Full‑featured ORM (e.g., Prisma)** | Overkill for a simple SQLite store; introduces additional schema migration tooling.
| **NestJS framework** | Provides many features but adds boilerplate and startup overhead; Express satisfies all needs.
| **WebSocket instead of SSE** | SSE is sufficient for one‑way streaming from server to client and works with standard browsers without extra client libraries.
| **External OAuth providers** | GitHub OAuth was explicitly disabled; keeping the routes commented out avoids breaking builds.

## Future Improvements (Next Week)
- **TypeScript migration** for stricter type safety.
- **Dockerfile** and CI pipeline for reproducible builds.
- **WebSocket support** for bidirectional real‑time communication.
- **Enhanced monitoring** (Prometheus metrics, request tracing).
- **Integration tests** covering the full auth flow and SSE endpoint.
- **Configuration validation** using a schema library (e.g., `zod`).

---

### Running the Project
```bash
# Install dependencies
npm install

# Copy example env and fill values
cp .env.example .env

# Start the server (development mode)
npm run dev
```
The server will listen on the port defined in `.env` (default 8000) and expose the API documented in the code.

