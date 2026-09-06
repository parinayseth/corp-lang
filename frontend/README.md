# CorpLang web (Next.js)

Landing page, compiler playground, and language reference for CorpLang.

- **Stack:** Next.js 14 (App Router) · TypeScript · Tailwind CSS · CodeMirror 6 · `next-themes`
- **Rendering:** mostly static; the two `/api/*` routes are server-only proxies

## Pages

| Route       | What it is |
|-------------|------------|
| `/`         | Landing — pitch, sample program, keyword map |
| `/compiler` | Editor + **Run output** + program output + generated Python |
| `/docs`     | Language reference and known issues |

Light/dark follows the system theme and can be toggled from the header.

## How it talks to the backend

The browser only ever calls this app. `app/api/compile/route.ts` and
`app/api/transpile/route.ts` run on the Next.js server and forward the request
to the FastAPI service at `BACKEND_URL`. The backend URL is never sent to the
browser, and there are no CORS hoops.

## Config

| Var | Default | Meaning |
|-----|---------|---------|
| `BACKEND_URL` | `http://127.0.0.1:8000` | FastAPI base URL, read server-side only |

Local dev reads `.env.local` (copy from `.env.local.example`). In Docker the
value is baked into `docker-compose.yml` (`http://backend:8000`).

## Local development

```bash
npm install
cp .env.local.example .env.local     # Windows: copy ...
npm run dev                           # http://localhost:3000
```

Other scripts: `npm run build`, `npm run start` (serves the production build on
port 3000), `npm run lint`.

## Docker

`next.config.mjs` sets `output: "standalone"`, so the image is a slim runtime
bundle with its own Node server.

```bash
docker build -t corplang-frontend .
docker run --rm -p 3000:3000 -e BACKEND_URL=http://host.docker.internal:8000 corplang-frontend
```

Usually you want the whole stack instead — from the repo root:

```bash
docker compose up --build
```

## Copyright

&copy; 2026 [parinayseth](https://github.com/parinayseth). All rights reserved.
