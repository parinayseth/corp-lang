# Starts the FastAPI backend and the Next.js frontend together (Windows / PowerShell).
# Backend  -> http://127.0.0.1:8000
# Frontend -> http://localhost:3000
# Press Ctrl+C to stop the frontend; close the spawned window to stop the backend.

$ErrorActionPreference = "Stop"
$root = $PSScriptRoot

$backendCmd = "cd `"$root\backend`"; " +
  "if (Test-Path .venv\Scripts\Activate.ps1) { . .venv\Scripts\Activate.ps1 }; " +
  "uvicorn main:app --reload --port 8000"

Start-Process powershell -ArgumentList "-NoExit", "-Command", $backendCmd | Out-Null
Write-Host "Backend starting in a new window (port 8000)..." -ForegroundColor Green

Set-Location "$root\frontend"
if (-not (Test-Path node_modules)) {
  Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
  npm install
}
if (-not (Test-Path .env.local)) {
  Copy-Item .env.local.example .env.local
}
npm run dev
