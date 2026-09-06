import { Link } from "react-router-dom";

import {
  ArrowRight,
  BookOpen,
  Play,
  Sparkles,
  Terminal,
} from "@/components/icons";
import { useDocumentTitle } from "@/lib/use-document-title";

const SNIPPET = `DELIVERABLE greet(name)
    PING "Hi " + name + ", circling back!"
THANKS

FOR EACH person IN ["Sam", "Riley", "Jordan"]
    greet(person)

BANDWIDTH shipped ALIGN LOCKED IN
TOUCH BASE shipped
    PING "deployed to prod"`;

const MAPPINGS: [string, string][] = [
  ["TOUCH BASE ready", "if ready:"],
  ["CIRCLE BACK count > 0", "while count > 0:"],
  ["DELIVERABLE build(x)", "def build(x):"],
  ["PING status", "print(status)"],
  ["BANDWIDTH n ALIGN 0", "n = 0"],
  ["LOCKED IN / GHOSTED", "True / False"],
];

const FEATURES = [
  {
    icon: Terminal,
    title: "Corporate keywords",
    body: "TOUCH BASE, CIRCLE BACK, DELIVERABLE, PING. Indentation-based blocks, just like Python — no braces, no semicolons.",
  },
  {
    icon: Play,
    title: "Runs for real",
    body: "Every program is transpiled to Python and executed on a FastAPI service in an isolated process with a hard timeout.",
  },
  {
    icon: Sparkles,
    title: "Light & dark",
    body: "A calm, readable interface that follows your system theme and flips instantly with one click.",
  },
];

export function Home() {
  useDocumentTitle();

  return (
    <div>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pb-10 pt-14 sm:px-6 sm:pt-20">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              A programming language that talks like your standup
            </span>

            <h1 className="mt-5 text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">
              Write code in
              <span className="text-primary"> corporate speak.</span>
            </h1>

            <p className="mt-4 max-w-xl text-lg text-muted">
              CorpLang transpiles buzzword-laden syntax into clean Python and
              runs it.{" "}
              <code className="rounded bg-card-muted px-1.5 py-0.5 font-mono text-sm">
                TOUCH BASE
              </code>{" "}
              for{" "}
              <code className="rounded bg-card-muted px-1.5 py-0.5 font-mono text-sm">
                if
              </code>
              ,{" "}
              <code className="rounded bg-card-muted px-1.5 py-0.5 font-mono text-sm">
                CIRCLE BACK
              </code>{" "}
              for{" "}
              <code className="rounded bg-card-muted px-1.5 py-0.5 font-mono text-sm">
                while
              </code>
              , and yes,{" "}
              <code className="rounded bg-card-muted px-1.5 py-0.5 font-mono text-sm">
                THANKS
              </code>{" "}
              to close a block.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/compiler"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:brightness-110"
              >
                Open the compiler
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/docs"
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground transition hover:bg-card-muted"
              >
                <BookOpen className="h-4 w-4" />
                Read the docs
              </Link>
            </div>
          </div>

          {/* Code card */}
          <div className="animate-fade-up rounded-2xl border border-border bg-card shadow-sm">
            <div className="flex items-center gap-1.5 border-b border-border px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
              <span className="ml-2 font-mono text-xs text-muted">
                standup.corp
              </span>
            </div>
            <pre className="overflow-x-auto px-4 py-4 font-mono text-[13px] leading-relaxed text-foreground">
              {SNIPPET}
            </pre>
          </div>
        </div>
      </section>

      {/* Feature grid */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-border bg-card p-5"
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-primary">
                <f.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-3 font-semibold tracking-tight">{f.title}</h3>
              <p className="mt-1.5 text-sm text-muted">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mapping table */}
      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
          <h2 className="text-xl font-semibold tracking-tight">How it maps</h2>
          <p className="mt-1 text-sm text-muted">
            Each line is rewritten to one line of Python by a small set of regex
            rules.
          </p>

          <div className="mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-2">
            {MAPPINGS.map(([corp, py]) => (
              <div
                key={corp}
                className="flex items-center gap-3 border-b border-border/60 pb-3 font-mono text-[13px]"
              >
                <span className="text-foreground">{corp}</span>
                <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted" />
                <span className="text-primary">{py}</span>
              </div>
            ))}
          </div>

          <Link
            to="/docs"
            className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
          >
            Full language reference
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
