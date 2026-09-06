I want you to migrate this project from the current Next.js + Vercel Services architecture to a simpler React + Vite frontend with a separately deployed FastAPI backend.

IMPORTANT:
- Do NOT rebuild the UI from scratch.
- Preserve the existing CorpLang UI, styling, pages, compiler/editor, examples, docs, and user experience as much as possible.
- First inspect the entire repository and understand the current architecture before making changes.
- Make the changes directly in the repository.
- Do not just give me instructions.
- Do not delete functionality unless it is genuinely Next.js-specific and unnecessary.
- Keep the backend logic unchanged unless deployment compatibility requires a change.

CURRENT PROJECT STRUCTURE IS ROUGHLY:

project/
├── frontend/          # currently Next.js
│   ├── app/
│   │   ├── api/
│   │   │   ├── compile/route.ts
│   │   │   └── transpile/route.ts
│   │   ├── compiler/
│   │   ├── docs/
│   │   └── ...
│   └── ...
├── backend/
│   ├── main.py
│   ├── runner.py
│   ├── corplang_core.py
│   ├── requirements.txt
│   └── ...
└── vercel.json

The FastAPI backend currently has:

- GET /health
- POST /transpile
- POST /compile

backend/main.py contains:

    app = FastAPI(...)

The backend also executes generated Python code through runner.py, so keep that behavior intact.

CURRENT NEXT.JS API PROXY:

frontend/app/api/compile/route.ts currently proxies to:

    const BACKEND_URL = process.env.BACKEND_URL ?? "http://127.0.0.1:8000";

and calls:

    ${BACKEND_URL}/compile

There is a similar route for /transpile.

I want to REMOVE this Next.js API proxy architecture entirely.

TARGET ARCHITECTURE:

Frontend:
    React + Vite
    deployed independently to Vercel

Backend:
    FastAPI
    deployed independently on a backend-friendly platform such as Render/Railway/etc.
    Do NOT deploy the FastAPI backend as a Vercel Service anymore.

TARGET FLOW:

Browser
  |
  | POST https://BACKEND_URL/compile
  v
FastAPI
  |
  v
runner.py / CorpLang compiler

Frontend should call FastAPI directly.

--------------------------------------------------
TASK 1 — INSPECT THE EXISTING FRONTEND
--------------------------------------------------

First inspect:

- package.json
- next.config.* if present
- tsconfig.json
- app directory
- components
- lib/utils
- all imports using next/*
- all API calls
- environment variables
- CSS/Tailwind configuration
- static assets
- routing
- compiler/editor implementation
- docs page

Identify everything that is Next.js-specific.

Then migrate the frontend to Vite + React + TypeScript.

--------------------------------------------------
TASK 2 — MIGRATE NEXT.JS TO VITE
--------------------------------------------------

Convert the existing frontend into a standard Vite React application.

Use:

- React
- React DOM
- Vite
- TypeScript

Preserve the existing styling and dependencies wherever possible.

Create/update:

    frontend/package.json
    frontend/index.html
    frontend/vite.config.ts
    frontend/tsconfig.json
    frontend/src/main.tsx
    frontend/src/App.tsx

Use the existing UI/components rather than recreating them.

If the current app router has pages such as:

    /
    /compiler
    /docs

replace the Next.js routing with React Router if routing is actually needed.

The resulting URLs should remain equivalent:

    /
    /compiler
    /docs

Do not unnecessarily introduce React Router if the existing application can be cleanly implemented without it, but preserve direct navigation to these pages.

--------------------------------------------------
TASK 3 — REMOVE NEXT.JS API ROUTES
--------------------------------------------------

Delete the Next.js API routes:

    frontend/app/api/compile/route.ts
    frontend/app/api/transpile/route.ts

Replace their functionality with direct frontend fetch calls to FastAPI.

Create a clean API helper, for example:

    frontend/src/lib/api.ts

with functions similar to:

    compileCode(code)
    transpileCode(code)
    healthCheck()

The API base URL must come from:

    import.meta.env.VITE_API_URL

Example:

    const API_URL = import.meta.env.VITE_API_URL;

    fetch(`${API_URL}/compile`, ...)

Do NOT hardcode localhost or a production backend URL into source code.

--------------------------------------------------
TASK 4 — ENVIRONMENT VARIABLES
--------------------------------------------------

For Vite use:

    VITE_API_URL

Create:

    frontend/.env.example

containing:

    VITE_API_URL=http://localhost:8000

Do NOT commit real production secrets.

If there is currently a BACKEND_URL environment variable used only by Next.js, remove that dependency from the frontend.

--------------------------------------------------
TASK 5 — FASTAPI BACKEND
--------------------------------------------------

Keep the existing FastAPI backend functionality.

Verify that:

    GET /health

returns:

    {"status": "ok"}

Verify:

    POST /transpile

and:

    POST /compile

continue working.

Review runner.py carefully because /compile executes generated Python code.

Do NOT rewrite runner.py unless necessary.

If there are Vercel-specific assumptions in the backend, remove them.

Make the backend easy to deploy as a standard FastAPI service.

Ensure there is an obvious production start command, for example:

    uvicorn main:app --host 0.0.0.0 --port $PORT

If a platform-specific start command is needed, document it.

--------------------------------------------------
TASK 6 — CORS
--------------------------------------------------

The existing backend already has CORS support using:

    CORS_ORIGINS

Keep this mechanism.

Make sure it works with:

    CORS_ORIGINS=https://<frontend-production-domain>

For local development, allow:

    http://localhost:5173

Do not simply use "*" in production unless absolutely necessary.

If multiple origins are useful, support comma-separated origins as the existing implementation does.

--------------------------------------------------
TASK 7 — REMOVE VERCEL SERVICES CONFIG
--------------------------------------------------

We are no longer using Vercel Services for FastAPI.

Remove the current multi-service Vercel configuration.

The frontend should be a normal Vite static deployment on Vercel.

Update/remove vercel.json as appropriate.

Do NOT leave the old:

    "services": {
        "frontend": ...,
        "backend": ...
    }

configuration.

If no vercel.json is required for Vite, remove it.

--------------------------------------------------
TASK 8 — VERCEL FRONTEND DEPLOYMENT
--------------------------------------------------

Configure the frontend so Vercel can deploy it as a normal Vite application.

Expected:

    Root Directory: frontend

Build command:

    npm run build

Output directory:

    dist

Make sure package.json has the appropriate scripts:

    "dev": "vite"
    "build": "tsc -b && vite build"
    "preview": "vite preview"

Adjust the exact TypeScript build command to match the project's existing setup if necessary.

--------------------------------------------------
TASK 9 — BACKEND DEPLOYMENT DOCUMENTATION
--------------------------------------------------

Create/update:

    backend/README.md

Document how to run locally:

    cd backend
    pip install -r requirements.txt
    uvicorn main:app --reload --port 8000

Document production deployment.

The backend should listen on:

    0.0.0.0

and use the platform-provided PORT when applicable.

Include environment variables:

    CORS_ORIGINS

--------------------------------------------------
TASK 10 — FRONTEND DEPLOYMENT DOCUMENTATION
--------------------------------------------------

Update the project README with:

LOCAL DEVELOPMENT:

Terminal 1:

    cd backend
    uvicorn main:app --reload --port 8000

Terminal 2:

    cd frontend
    npm install
    npm run dev

Frontend:

    http://localhost:5173

Backend:

    http://localhost:8000

Frontend .env:

    VITE_API_URL=http://localhost:8000

PRODUCTION:

Frontend Vercel environment variable:

    VITE_API_URL=https://<actual-backend-domain>

Backend environment variable:

    CORS_ORIGINS=https://<actual-frontend-domain>

--------------------------------------------------
TASK 11 — SEARCH FOR ALL OLD API REFERENCES
--------------------------------------------------

After migration, search the entire repository for:

    BACKEND_URL
    /api/compile
    /api/transpile
    /api/backend
    127.0.0.1:8000
    localhost:8000
    next/
    next/navigation
    next/link
    next/image
    NextResponse
    NextRequest

Remove/update references that are no longer valid.

Be careful not to modify documentation/examples that intentionally reference something else.

--------------------------------------------------
TASK 12 — TEST EVERYTHING
--------------------------------------------------

Before finishing, actually run:

Frontend:

    npm install
    npm run build

Backend:

    pip install -r requirements.txt

and run the FastAPI server.

Test:

    GET /health

Test:

    POST /transpile

Test:

    POST /compile

Verify the compiler UI can:

1. Load the application.
2. Navigate to Compiler.
3. Select an example.
4. Run the code.
5. Send the request to FastAPI.
6. Display the returned output.
7. Display errors correctly.
8. Navigate to Docs.

Fix any TypeScript/build/runtime errors you encounter.

--------------------------------------------------
IMPORTANT CONSTRAINTS
--------------------------------------------------

1. Preserve the existing UI.
2. Preserve the existing CorpLang syntax/compiler behavior.
3. Preserve the existing editor.
4. Preserve examples.
5. Preserve Docs.
6. Preserve dark/light styling if currently implemented.
7. Do not unnecessarily upgrade dependencies.
8. Do not rewrite the backend architecture.
9. Do not use Next.js after migration.
10. Do not use Next.js API routes.
11. Do not use Vercel Services.
12. Frontend communicates directly with FastAPI.
13. Production backend URL must come from VITE_API_URL.
14. Never hardcode the production backend URL.
15. Keep CORS correctly configured.
16. Do not commit .env files containing real deployment values.

--------------------------------------------------
FINAL OUTPUT
--------------------------------------------------

When finished, give me:

1. A concise summary of what you changed.
2. The final frontend directory structure.
3. The final backend directory structure.
4. The exact frontend environment variables.
5. The exact backend environment variables.
6. The exact Vercel settings for frontend deployment.
7. The exact backend deployment/start command.
8. All tests you ran and whether they passed.
9. Any remaining issues or assumptions.

Most importantly: MAKE THE CHANGES IN THE REPOSITORY, don't just tell me how to do them.