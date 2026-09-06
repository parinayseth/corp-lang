# Legacy

The original, pre-service versions of CorpLang. Kept for reference; not part
of the deployed app.

| File | What it is |
|------|------------|
| `corplang.py` | Standalone CLI transpiler. `python corplang.py example.corp` (add `--show` to print the generated Python). Its rule list is mirrored by `backend/corplang_core.py`, which is the maintained copy. |
| `example.corp` | Sample program for the CLI. |
| `index.html` | Single-file browser version — transpiler + editor + runner in one HTML file, executing Python client-side via Pyodide (loaded from a CDN). Open it directly, or serve the folder with `python -m http.server`. No backend required. |

For the current stack (FastAPI + Next.js) see the repo root `README.md`.
