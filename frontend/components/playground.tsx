"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";

import { EXAMPLES } from "@/lib/examples";
import { CopyButton } from "./copy-button";
import { Play, Spinner, Terminal } from "./icons";

const CodeEditor = dynamic(
  () => import("./code-editor").then((m) => m.CodeEditor),
  {
    ssr: false,
    loading: () => (
      <div className="h-[460px] animate-pulse rounded-xl border border-border bg-card-muted" />
    ),
  },
);

type CompileResult = {
  ok: boolean;
  output: string;
  python: string;
  error: string;
  truncated?: boolean;
  duration_ms?: number;
};

type Status = "idle" | "running" | "done" | "error";

const STORAGE_KEY = "corplang.source";

export function Playground() {
  const [code, setCode] = useState<string>(EXAMPLES[0].code);
  const [result, setResult] = useState<CompileResult | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [showPython, setShowPython] = useState(false);

  // restore last session's code
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setCode(saved);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, code);
    } catch {
      /* ignore */
    }
  }, [code]);

  const run = useCallback(async () => {
    setStatus("running");
    try {
      const res = await fetch("/api/compile", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();

      if (!res.ok) {
        setResult({
          ok: false,
          output: "",
          python: data?.python ?? "",
          error:
            typeof data?.detail === "string"
              ? data.detail
              : `Request failed (${res.status}).`,
        });
        setStatus("error");
        return;
      }

      setResult(data as CompileResult);
      setStatus(data.ok ? "done" : "error");
    } catch (err) {
      setResult({
        ok: false,
        output: "",
        python: "",
        error:
          "Could not reach the CorpLang API. Is the FastAPI backend running on port 8000?\n\n" +
          (err instanceof Error ? err.message : String(err)),
      });
      setStatus("error");
    }
  }, [code]);

  const running = status === "running";

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {/* ---- Editor column ---- */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <label className="text-xs font-semibold uppercase tracking-wide text-muted">
            Source
          </label>
          <select
            aria-label="Load an example"
            className="ml-auto rounded-lg border border-border bg-card px-2.5 py-1.5 text-sm text-foreground outline-none transition-colors hover:bg-card-muted focus:ring-2 focus:ring-ring"
            value=""
            onChange={(e) => {
              const ex = EXAMPLES.find((x) => x.name === e.target.value);
              if (ex) setCode(ex.code);
            }}
          >
            <option value="" disabled>
              Load example…
            </option>
            {EXAMPLES.map((ex) => (
              <option key={ex.name} value={ex.name}>
                {ex.name} — {ex.description}
              </option>
            ))}
          </select>
        </div>

        <CodeEditor value={code} onChange={setCode} onRun={run} />

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={run}
            disabled={running}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-[filter,opacity] hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {running ? (
              <Spinner className="h-4 w-4 animate-spin" />
            ) : (
              <Play className="h-4 w-4" />
            )}
            {running ? "Running…" : "Run output"}
          </button>

          <button
            type="button"
            onClick={() => setCode("")}
            className="rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-card-muted hover:text-foreground"
          >
            Clear
          </button>

          <span className="text-xs text-muted">
            <kbd className="rounded border border-border bg-card-muted px-1.5 py-0.5 font-mono text-[11px]">
              Ctrl
            </kbd>{" "}
            +{" "}
            <kbd className="rounded border border-border bg-card-muted px-1.5 py-0.5 font-mono text-[11px]">
              Enter
            </kbd>{" "}
            to run
          </span>
        </div>
      </div>

      {/* ---- Output column ---- */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold uppercase tracking-wide text-muted">
            Output
          </label>
          <StatusPill status={status} result={result} />
          {result?.python ? (
            <button
              type="button"
              onClick={() => setShowPython((v) => !v)}
              className="ml-auto text-xs font-medium text-muted underline-offset-4 hover:text-foreground hover:underline"
            >
              {showPython ? "Hide" : "Show"} generated Python
            </button>
          ) : null}
        </div>

        <div className="relative min-h-[280px] overflow-hidden rounded-xl border border-border bg-card-muted">
          {result ? (
            <pre
              className={`h-full max-h-[52vh] overflow-auto p-4 font-mono text-[13px] leading-relaxed ${
                result.ok
                  ? "text-foreground"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {result.ok
                ? result.output || "(no output)"
                : (result.output ? result.output + "\n" : "") + result.error}
              {result.truncated ? "\n\n… output truncated." : ""}
            </pre>
          ) : (
            <div className="flex h-[280px] flex-col items-center justify-center gap-2 text-center text-sm text-muted">
              <Terminal className="h-6 w-6" />
              <p>
                Press{" "}
                <span className="font-medium text-foreground">Run output</span>{" "}
                to execute your program.
              </p>
            </div>
          )}
        </div>

        {showPython && result?.python ? (
          <div className="overflow-hidden rounded-xl border border-border">
            <div className="flex items-center justify-between border-b border-border bg-card-muted px-3 py-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted">
                Generated Python
              </span>
              <CopyButton text={result.python} />
            </div>
            <pre className="max-h-[40vh] overflow-auto bg-card-muted p-4 font-mono text-[13px] leading-relaxed text-foreground">
              {result.python}
            </pre>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function StatusPill({
  status,
  result,
}: {
  status: Status;
  result: CompileResult | null;
}) {
  const map: Record<Status, { dot: string; label: string }> = {
    idle: { dot: "bg-muted", label: "Ready" },
    running: { dot: "bg-amber-500 animate-pulse", label: "Running" },
    done: { dot: "bg-primary", label: "Success" },
    error: { dot: "bg-red-500", label: "Error" },
  };
  const s = map[status];
  const ms = result?.duration_ms;

  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-muted">
      <span className={`h-2 w-2 rounded-full ${s.dot}`} />
      {s.label}
      {status !== "running" && status !== "idle" && typeof ms === "number"
        ? ` · ${ms} ms`
        : ""}
    </span>
  );
}
