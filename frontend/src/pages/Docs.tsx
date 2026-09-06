import { Link } from "react-router-dom";

import { ArrowRight } from "@/components/icons";
import { KEYWORD_ROWS } from "@/lib/keywords";
import { useDocumentTitle } from "@/lib/use-document-title";

const EXAMPLE = `-- CorpLang: a quick walkthrough

BANDWIDTH runway ALIGN 3
BANDWIDTH shipped ALIGN GHOSTED

CIRCLE BACK runway > 0
    PING "Q" + str(runway) + ": still iterating"
    runway ALIGN runway - 1
THANKS

RISK
    BANDWIDTH plan ALIGN ["scope", "build", "ship"]
    PING "Executing on " + plan[2]
    shipped ALIGN LOCKED IN
DAMAGE CONTROL
    PING "We don't talk about that sprint."
RETRO
    PING "Shipped: " + str(shipped)`;

export function Docs() {
  useDocumentTitle("Docs");

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="animate-fade-up">
        <h1 className="text-3xl font-semibold tracking-tight">CorpLang docs</h1>
        <p className="mt-3 text-lg text-muted">
          CorpLang is the programming language for people who are technically in
          back-to-backs all day. Every line is rewritten into exactly one line of
          Python by a list of regular expressions. If you already know how to
          sound busy in Python, you know CorpLang.
        </p>
      </div>

      <section className="mt-10">
        <h2 className="text-xl font-semibold tracking-tight">Getting buy-in</h2>
        <ul className="mt-3 space-y-2 text-[15px] text-muted">
          <li>
            <span className="font-medium text-foreground">In this app:</span>{" "}
            open the{" "}
            <Link to="/compiler" className="text-primary hover:underline">
              Compiler
            </Link>
            , type CorpLang, press <em>Run output</em>. The app sends your
            program straight to the FastAPI service, which transpiles and
            executes it in a throwaway process.
          </li>
          <li>
            <span className="font-medium text-foreground">Command line:</span>{" "}
            <code className="rounded bg-card-muted px-1.5 py-0.5 font-mono text-sm">
              python legacy/corplang.py legacy/example.corp
            </code>{" "}
            &mdash; the original standalone CLI (add{" "}
            <code className="rounded bg-card-muted px-1.5 py-0.5 font-mono text-sm">
              --show
            </code>{" "}
            to see the generated Python and lose the mystique).
          </li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold tracking-tight">
          Language reference
        </h2>
        <p className="mt-2 text-[15px] text-muted">
          Left column is what you write. Middle column is what Python actually
          gets. Right column is what it means once the meeting is over.
        </p>
        <div className="mt-4 overflow-hidden rounded-xl border border-border">
          <table className="w-full border-collapse text-[13.5px]">
            <thead>
              <tr className="bg-card-muted text-left">
                <th className="px-3 py-2.5 font-semibold uppercase tracking-wide text-muted">
                  CorpLang
                </th>
                <th className="px-3 py-2.5 font-semibold uppercase tracking-wide text-muted">
                  Python
                </th>
                <th className="hidden px-3 py-2.5 font-semibold uppercase tracking-wide text-muted sm:table-cell">
                  What it means
                </th>
              </tr>
            </thead>
            <tbody>
              {KEYWORD_ROWS.map((row) => (
                <tr key={row.corp} className="border-t border-border align-top">
                  <td className="px-3 py-2.5">
                    <code className="font-mono text-foreground">{row.corp}</code>
                  </td>
                  <td className="px-3 py-2.5">
                    <code className="font-mono text-primary">{row.py}</code>
                  </td>
                  <td className="hidden px-3 py-2.5 text-muted sm:table-cell">
                    {row.note}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm text-muted">
          Anything with no matching rule — expressions, function calls,
          operators, list/dict literals, f-strings — passes straight through to
          Python, so <code className="font-mono">range()</code>, arithmetic,
          comparisons and <code className="font-mono">and / or / not</code> all
          just work. <code className="font-mono">ALIGN</code>,{" "}
          <code className="font-mono">SYNERGY</code>,{" "}
          <code className="font-mono">LOCKED IN</code> and friends are only
          swapped out in <em>code</em>, so you can safely{" "}
          <code className="font-mono">
            PING &quot;we are so LOCKED IN right now&quot;
          </code>{" "}
          without it turning into <code className="font-mono">True</code>.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold tracking-tight">
          Blocks &amp; indentation
        </h2>
        <p className="mt-3 text-[15px] text-muted">
          There is no block terminator, because nothing at work ever truly ends.
          A header line ending in <code className="font-mono">:</code> (produced
          by <code className="font-mono">TOUCH BASE</code>,{" "}
          <code className="font-mono">FOR EACH</code>,{" "}
          <code className="font-mono">DELIVERABLE</code>,{" "}
          <code className="font-mono">RISK</code>…) opens a block; indent the
          body four spaces, exactly like Python.{" "}
          <code className="font-mono">THANKS</code> is optional sugar that reads
          like the end of an email — it is deleted before Python sees it and
          changes nothing.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold tracking-tight">Example</h2>
        <pre className="mt-4 overflow-x-auto rounded-xl border border-border bg-card-muted p-4 font-mono text-[13px] leading-relaxed">
          {EXAMPLE}
        </pre>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold tracking-tight">
          Known issues (on the roadmap)
        </h2>
        <ul className="mt-3 space-y-2 text-[15px] text-muted">
          <li>
            There is no type system. There is no plan for a type system. It has
            been added to the backlog, where it will be groomed quarterly and
            never picked up.
          </li>
          <li>
            <code className="font-mono">THANKS</code> is purely decorative. If you
            were hoping it did something, that is a growth opportunity for both of
            us.
          </li>
          <li>
            Programs run with a hard{" "}
            <span className="font-medium text-foreground">5&nbsp;second</span>{" "}
            wall-clock limit. An infinite{" "}
            <code className="font-mono">CIRCLE BACK</code> is killed and reported
            as a timeout — the one meeting that does get cut off.
          </li>
          <li>
            Output is capped at ~20,000 characters. Everything past that is
            descoped.
          </li>
        </ul>
      </section>

      <div className="mt-12 rounded-xl border border-border bg-card p-5">
        <p className="text-sm text-muted">Ready to action this?</p>
        <Link
          to="/compiler"
          className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
        >
          Open the compiler
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
