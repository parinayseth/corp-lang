# CorpLang

A playful programming language that transpiles corporate jargon into Python —
a FastAPI backend that runs it, and a React + Vite frontend to write it in.

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
├─ docker-compose.yml   # local full stack: docker compose up --build
├─ backend/             # FastAPI service — deploy on Render / Railway / Fly / …
│  ├─ corplang_core.py  # the transpiler (regex line rewrite → Python)
│  ├─ runner.py         # isolated python -I child + timeout + output caps
│  ├─ main.py           # API: /compile, /transpile, /health
│  ├─ Procfile          # web: uvicorn main:app --host 0.0.0.0 --port $PORT
│  └─ Dockerfile
├─ frontend/            # React + Vite SPA — deploy on Vercel (root dir: frontend)
│  ├─ src/              # main.tsx, App.tsx, pages/, components/, lib/
│  ├─ vercel.json       # SPA rewrite
│  └─ Dockerfile        # optional: nginx serving dist/
└─ legacy/              # original CLI (corplang.py) + single-file Pyodide page
```

## Architecture

```
Browser ──POST {VITE_API_URL}/compile──▶ FastAPI ──▶ runner.py / CorpLang compiler
```

The frontend is a static SPA and calls the FastAPI service **directly**. The two
are deployed and scaled independently. CORS on the backend restricts which
frontend origins may call it.

## Local development

**Terminal 1 — backend** (<http://localhost:8000>)

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate            # Windows
# source .venv/bin/activate       # macOS / Linux
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

**Terminal 2 — frontend** (<http://localhost:5173>)

```bash
cd frontend
npm install
cp .env.example .env              # Windows: copy .env.example .env
npm run dev
```

`frontend/.env`:

```
VITE_API_URL=http://localhost:8000
```

On Windows, `./dev.ps1` starts both. Or run the whole stack in containers with
`docker compose up --build` (frontend on <http://localhost:8080>).

## Pages

| Route       | What it is |
|-------------|------------|
| `/`         | Landing — pitch, sample, keyword map |
| `/compiler` | Editor + Run button + output + generated Python |
| `/docs`     | Language reference and known issues |

Light/dark follows the system theme and toggles from the header.

## Production

**Frontend — Vercel**

| Setting | Value |
|---------|-------|
| Root Directory | `frontend` |
| Framework Preset | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Environment Variable | `VITE_API_URL=https://<actual-backend-domain>` |

**Backend — Render / Railway / Fly / any container host**

| Item | Value |
|------|-------|
| Start command | `uvicorn main:app --host 0.0.0.0 --port $PORT` |
| Environment Variable | `CORS_ORIGINS=https://<actual-frontend-domain>` |
| Optional | `CORS_ORIGINS_REGEX=https://.*\.vercel\.app` (allow Vercel previews) |

Do **not** deploy the backend as a Vercel Service.

## Config reference

| Where | Var | Default | Meaning |
|-------|-----|---------|---------|
| `frontend/.env` / Vercel | `VITE_API_URL` | `http://localhost:8000` | FastAPI base URL, inlined at build time |
| backend env | `CORS_ORIGINS` | `http://localhost:5173,http://127.0.0.1:5173` | Allowed browser origins (comma-separated) |
| backend env | `CORS_ORIGINS_REGEX` | _(unset)_ | Optional regex for dynamic origins |
| backend env | `PORT` | `8000` | Port to bind |

Hard limits live in backend code: `MAX_SOURCE_BYTES` (`main.py`),
`DEFAULT_TIMEOUT` and `MAX_OUTPUT` (`runner.py`).

## Deployment notes

- **Not a sandbox.** `backend/runner.py` isolates each program in a short-lived
  `python -I` child with a wall-clock timeout and output caps. That stops
  runaway loops — it does **not** stop the child importing the stdlib, reading
  files, or opening sockets. Before taking public, untrusted traffic, run the
  backend with no network or writable filesystem, or behind gVisor / seccomp.
- The backend image runs `uvicorn` as a non-root user and honours `$PORT`.

## Language

See `/docs` in the running app (source: `frontend/src/pages/Docs.tsx`) or
[`legacy/README.md`](legacy/README.md) for the original CLI. Every CorpLang line
maps to exactly one line of Python.

## Copyright

&copy; 2026 [parinayseth](https://github.com/parinayseth). All rights reserved.
