# CorpLang web (React + Vite)

Landing page, compiler playground, and language reference for CorpLang.

- **Stack:** React 18 · Vite 5 · TypeScript · React Router 6 · Tailwind CSS · CodeMirror 6
- **Output:** a static SPA in `dist/` — deployed to Vercel as a normal Vite app

## Pages

| Route       | What it is |
|-------------|------------|
| `/`         | Landing — pitch, sample program, keyword map |
| `/compiler` | Editor + **Run output** + program output + generated Python |
| `/docs`     | Language reference and known issues |

Light/dark follows the system theme and can be toggled from the header
(`src/lib/theme.tsx`; no-flash script in `index.html`).

## How it talks to the backend

The browser calls the FastAPI service **directly**. `src/lib/api.ts` reads the
base URL from `import.meta.env.VITE_API_URL` — it is never hard-coded.

```
Browser ──POST {VITE_API_URL}/compile──▶ FastAPI ──▶ runner.py
```

## Config

| Var | Example | Meaning |
|-----|---------|---------|
| `VITE_API_URL` | `http://localhost:8000` | Base URL of the FastAPI backend. Inlined at build time. |

Local dev reads `.env` (copy it from `.env.example`). In production set
`VITE_API_URL` in the Vercel project's Environment Variables.

## Local development

```bash
npm install
cp .env.example .env        # Windows: copy .env.example .env
npm run dev                  # http://localhost:5173
```

Needs the backend running (see `../backend/README.md`).

Scripts: `npm run dev`, `npm run build` (`tsc --noEmit && vite build` → `dist/`),
`npm run preview`.

## Deploying to Vercel

| Setting | Value |
|---------|-------|
| Root Directory | `frontend` |
| Framework Preset | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Environment Variable | `VITE_API_URL=https://<your-backend-domain>` |

`vercel.json` in this folder adds the SPA rewrite so `/compiler` and `/docs`
resolve on hard refresh.

## Docker (optional, self-hosting)

`VITE_API_URL` is baked in at build time, so pass it as a build arg:

```bash
docker build --build-arg VITE_API_URL=https://api.example.com -t corplang-frontend .
docker run --rm -p 8080:80 corplang-frontend
```

The image is nginx serving `dist/` with an SPA fallback (`nginx.conf`). For the
full local stack, use `docker compose up --build` from the repo root.
