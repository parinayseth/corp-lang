# CorpLang API (FastAPI)

Transpiles CorpLang → Python and executes it in a short-lived, isolated child
process with a wall-clock timeout.

## Endpoints

| Method | Path         | Body                | Returns |
|--------|--------------|---------------------|---------|
| POST   | `/compile`   | `{ "code": "..." }` | `{ ok, output, python, error, truncated, duration_ms }` |
| POST   | `/transpile` | `{ "code": "..." }` | `{ python }` |
| GET    | `/health`    | –                   | `{ "status": "ok" }` |
| GET    | `/docs`      | –                   | Interactive OpenAPI UI |

## Local development

```bash
python -m venv .venv
.venv\Scripts\activate            # Windows
# source .venv/bin/activate       # macOS / Linux
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Check: <http://127.0.0.1:8000/health> → `{"status":"ok"}`

## Docker

```bash
docker build -t corplang-backend .
docker run --rm -p 8000:8000 corplang-backend
```

Or run the whole stack from the repo root with `docker compose up --build`.

## Config

| Var | Default | Meaning |
|-----|---------|---------|
| `CORS_ORIGINS` | `*` | Comma-separated browser origins allowed to call the API directly. Only matters when the browser bypasses the Next.js proxy. |

Copy `.env.example` → `.env` to set it locally. Hard limits live in code:
`MAX_SOURCE_BYTES` (`main.py`), `DEFAULT_TIMEOUT` and `MAX_OUTPUT` (`runner.py`).

## Files

| File | Role |
|------|------|
| `main.py` | FastAPI app, request models, size guard |
| `corplang_core.py` | The transpiler (line-by-line regex rewrite to Python) |
| `runner.py` | Runs the generated Python in an isolated `python -I` child |

## Security note

`runner.py` gives you process isolation + a timeout + output caps. That stops
runaway loops and huge outputs, **but it is not a real sandbox** — the child can
still import the standard library, read files, and open sockets. Before exposing
this to untrusted traffic, run the child inside a container / gVisor / firecracker
/ seccomp jail with network and filesystem access dropped.
