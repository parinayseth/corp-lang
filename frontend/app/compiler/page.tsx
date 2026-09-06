import type { Metadata } from "next";

import { Playground } from "@/components/playground";

export const metadata: Metadata = {
  title: "Compiler",
  description:
    "Write CorpLang in the browser and run it. Transpiled to Python and executed on the CorpLang API with a time limit.",
};

export default function CompilerPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="animate-fade-up">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Compiler
        </h1>
        <p className="mt-2 max-w-2xl text-muted">
          Write CorpLang on the left and press{" "}
          <span className="font-medium text-foreground">Run output</span>. Your
          program is transpiled to Python and executed on the CorpLang API in an
          isolated process with a {""}
          <span className="font-medium text-foreground">5&nbsp;second</span> time
          limit.
        </p>
      </div>

      <div className="mt-8">
        <Playground />
      </div>
    </div>
  );
}
