# CorpLang API (FastAPI)

Transpiles CorpLang → Python and executes it in a short-lived, isolated child
process with a wall-clock timeout. Deployed independently of the frontend; the
browser calls it directly.

## Endpoints

| Method | Path         | Body                | Returns |
|--------|--------------|---------------------|---------|
| POST   | `/compile`   | `{ "code": "..." }` | `{ ok, output, python, error, truncated, duration_ms }` |
| POST   | `/transpile` | `{ "code": "..." }` | `{ python }` |
| GET    | `/health`    | –                   | `{ "status": "ok" }` |
| GET    | `/docs`      | –                   | Interactive OpenAPI UI |

## Local development

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate            # Windows
# source .venv/bin/activate       # macOS / Linux
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Check: <http://127.0.0.1:8000/health> → `{"status":"ok"}`

## Production deployment

The server must bind `0.0.0.0` and the platform-provided `$PORT`:

```bash
uvicorn main:app --host 0.0.0.0 --port $PORT
```

- **Render / Railway / Fly / Heroku-likes:** a `Procfile` (`web: uvicorn main:app --host 0.0.0.0 --port $PORT`) is included, and the `Dockerfile` honours `$PORT` too. Set the start command to the line above if the platform asks.
- **Docker:**

  ```bash
  docker build -t corplang-backend .
  docker run --rm -p 8000:8000 -e CORS_ORIGINS=https://your-frontend.vercel.app corplang-backend
  ```

- Do **not** deploy this as a Vercel Service.

## Config (environment variables)

| Var | Default | Meaning |
|-----|---------|---------|
| `CORS_ORIGINS` | `http://localhost:5173,http://127.0.0.1:5173` | Comma-separated browser origins allowed to call the API. Set to your frontend origin in production, e.g. `https://your-frontend.vercel.app`. `*` is accepted but avoid it in production. |
| `CORS_ORIGINS_REGEX` | _(unset)_ | Optional regex for dynamic origins, e.g. `https://.*\.vercel\.app` to allow Vercel preview URLs. |
| `PORT` | `8000` | Port to bind (usually injected by the host). |

Copy `.env.example` → `.env` to set these locally. Hard limits live in code:
`MAX_SOURCE_BYTES` (`main.py`), `DEFAULT_TIMEOUT` and `MAX_OUTPUT` (`runner.py`).

## Files

| File | Role |
|------|------|
| `main.py` | FastAPI app, request models, size guard, CORS |
| `corplang_core.py` | The transpiler (line-by-line regex rewrite to Python) |
| `runner.py` | Runs the generated Python in an isolated `python -I` child |

## Security note

`runner.py` gives you process isolation + a timeout + output caps. That stops
runaway loops and huge outputs, **but it is not a real sandbox** — the child can
still import the standard library, read files, and open sockets. Before exposing
this to untrusted traffic, run the child inside a container / gVisor / firecracker
/ seccomp jail with network and filesystem access dropped.
