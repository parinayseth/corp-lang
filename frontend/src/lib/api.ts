/**
 * Thin client for the FastAPI backend. The browser talks to it directly;
 * the base URL comes from VITE_API_URL (never hard-coded).
 */

const RAW_API_URL = import.meta.env.VITE_API_URL ?? "";
const API_URL = RAW_API_URL.replace(/\/+$/, "");

export type CompileResult = {
  ok: boolean;
  output: string;
  python: string;
  error: string;
  truncated?: boolean;
  duration_ms?: number;
};

export type TranspileResult = {
  python: string;
};

export type HealthResult = {
  status: string;
};

/** Error carrying the backend's `detail` message (and any JSON payload). */
export class ApiError extends Error {
  payload: unknown;
  status: number;
  constructor(message: string, status: number, payload?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

function requireBaseUrl(): string {
  if (!API_URL) {
    throw new Error(
      "VITE_API_URL is not set. Copy frontend/.env.example to frontend/.env " +
        "(local) or set it in your Vercel project settings (production).",
    );
  }
  return API_URL;
}

async function request<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${requireBaseUrl()}${path}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  let data: unknown = undefined;
  try {
    data = text ? JSON.parse(text) : undefined;
  } catch {
    data = text;
  }

  if (!res.ok) {
    const detail =
      data && typeof data === "object" && "detail" in data
        ? String((data as { detail: unknown }).detail)
        : `Request failed (${res.status}).`;
    throw new ApiError(detail, res.status, data);
  }

  return data as T;
}

export function compileCode(code: string): Promise<CompileResult> {
  return request<CompileResult>("/compile", { code });
}

export function transpileCode(code: string): Promise<TranspileResult> {
  return request<TranspileResult>("/transpile", { code });
}

export async function healthCheck(): Promise<HealthResult> {
  const res = await fetch(`${requireBaseUrl()}/health`);
  if (!res.ok) {
    throw new ApiError(`Health check failed (${res.status}).`, res.status);
  }
  return (await res.json()) as HealthResult;
}
