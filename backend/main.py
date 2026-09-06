"""
CorpLang API — FastAPI service that transpiles and runs CorpLang programs.

Run locally:
    pip install -r requirements.txt
    uvicorn main:app --reload --port 8000

Interactive docs at http://127.0.0.1:8000/docs
"""

from __future__ import annotations

import os

from corplang_core import transpile
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from runner import DEFAULT_TIMEOUT, execute

MAX_SOURCE_BYTES = 50_000

# Comma-separated browser origins allowed to call the API. The default covers a
# local Vite dev server; set it explicitly in production, e.g.
#   CORS_ORIGINS=https://your-frontend.vercel.app
_origins = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173")
ALLOW_ORIGINS = (
    ["*"]
    if _origins.strip() == "*"
    else [o.strip() for o in _origins.split(",") if o.strip()]
)
# Optional regex for dynamic origins such as Vercel preview URLs, e.g.
#   CORS_ORIGINS_REGEX=https://.*\.vercel\.app
_origins_regex = os.getenv("CORS_ORIGINS_REGEX") or None

app = FastAPI(
    title="CorpLang API",
    version="1.0.0",
    description="Transpile corporate jargon to Python and run it.",
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOW_ORIGINS,
    allow_origin_regex=_origins_regex,
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


class CompileRequest(BaseModel):
    code: str = Field(..., description="CorpLang source code")


class CompileResponse(BaseModel):
    ok: bool
    output: str
    python: str
    error: str
    truncated: bool = False
    duration_ms: int = 0


class TranspileResponse(BaseModel):
    python: str


def _guard(code: str) -> None:
    if not code.strip():
        raise HTTPException(status_code=400, detail="No code submitted.")
    if len(code.encode("utf-8")) > MAX_SOURCE_BYTES:
        raise HTTPException(
            status_code=413,
            detail=f"Program too large (limit {MAX_SOURCE_BYTES} bytes).",
        )


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}


@app.post("/transpile", response_model=TranspileResponse)
def transpile_endpoint(req: CompileRequest) -> TranspileResponse:
    _guard(req.code)
    return TranspileResponse(python=transpile(req.code))


@app.post("/compile", response_model=CompileResponse)
def compile_endpoint(req: CompileRequest) -> CompileResponse:
    _guard(req.code)
    try:
        python_src = transpile(req.code)
    except Exception as exc:  # noqa: BLE001 - report any transpile failure to the client
        raise HTTPException(status_code=400, detail=f"Transpile failed: {exc}") from exc

    result = execute(python_src, timeout=DEFAULT_TIMEOUT)
    return CompileResponse(python=python_src, **result)
