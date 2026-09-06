# CorpLang

A playful programming language that transpiles corporate jargon into Python —
with a FastAPI backend that runs it and a Next.js frontend to write it in.

```corp
BANDWIDTH runway ALIGN 3
CIRCLE BACK runway > 0
    PING "Q" + str(runway) + ": still iterating"
    runway ALIGN runway - 1

RISK
    PING "shipping it"
DAMAGE CONTROL
    PING "we don't talk about that sprint"
```

## Layout

```
corplang/
├─ docker-compose.yml   # full stack: docker compose up --build
├─ backend/             # FastAPI service — transpile + run
│  ├─ corplang_core.py  # the transpiler (regex line rewrite → Python)
│  ├─ runner.py         # isolated python -I child + timeout + output caps
│  ├─ main.py           # API: /compile, /transpile, /health
│  └─ Dockerfile
├─ frontend/            # Next.js app — landing, compiler, docs
│  └─ Dockerfile        # standalone output
└─ legacy/              # original CLI (corplang.py) + single-file Pyodide page
```

## Architecture

```
browser ──▶ Next.js (:3000) ──▶ /api/compile route ──▶ FastAPI (:8000) ──▶ isolated python -I child
```

The browser only ever talks to the Next.js app. The Next.js **server** relays
`/api/compile` and `/api/transpile` to FastAPI (`BACKEND_URL`), so the backend
URL is never exposed to the client and there are no CORS hoops in the browser.

## Quick start — Docker

```bash
docker compose up --build
```

Open <http://localhost:3000>. The frontend waits for the backend's health check
before starting.

## Quick start — local (two terminals)

**1 · Backend**

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate            # Windows
# source .venv/bin/activate       # macOS / Linux
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

**2 · Frontend**

```bash
cd frontend
npm install
cp .env.local.example .env.local  # Windows: copy ...
npm run dev
```

Open <http://localhost:3000>. On Windows, `./dev.ps1` does both at once.

## Pages

| Route       | What it is |
|-------------|------------|
| `/`         | Landing — pitch, sample, keyword map |
| `/compiler` | Editor + Run button + output + generated Python |
| `/docs`     | Language reference and known issues |

Light/dark follows the system theme and toggles from the header.

## Config

| Where | Var | Default | Meaning |
|-------|-----|---------|---------|
| `frontend/.env.local` (or compose) | `BACKEND_URL` | `http://127.0.0.1:8000` | FastAPI base URL, server-side only |
| `backend/.env` (or compose) | `CORS_ORIGINS` | `*` | Allowed browser origins — only matters if the browser hits FastAPI directly |

Hard limits live in backend code: `MAX_SOURCE_BYTES` (`main.py`),
`DEFAULT_TIMEOUT` and `MAX_OUTPUT` (`runner.py`).

## Deployment notes

- **Not a sandbox.** `backend/runner.py` isolates each program in a short-lived
  `python -I` child with a wall-clock timeout and output caps. That stops
  runaway loops — it does **not** stop the child importing the stdlib, reading
  files, or opening sockets. Before taking public, untrusted traffic, run the
  backend container with no network or writable filesystem, or behind
  gVisor / seccomp.
- The frontend image uses Next's `output: "standalone"` and runs `node server.js`
  as a non-root user; the backend image runs `uvicorn` as a non-root user.
- Put a TLS-terminating reverse proxy in front of the frontend, and scale the
  backend with multiple `uvicorn` workers / replicas.

## Language

See [`frontend/app/docs`](frontend/app/docs) (rendered at `/docs`) or
[`legacy/README.md`](legacy/README.md) for the original CLI. Every CorpLang line
maps to exactly one line of Python.

## Copyright

&copy; 2026 [parinayseth](https://github.com/parinayseth). All rights reserved.
