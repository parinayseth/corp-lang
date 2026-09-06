export type KeywordRow = {
  corp: string;
  py: string;
  note: string;
};

/** Reference table, ordered roughly the way the transpiler applies its rules. */
export const KEYWORD_ROWS: KeywordRow[] = [
  {
    corp: "-- note",
    py: "# note",
    note: "A comment. Put it in the doc nobody reads, not the meeting nobody remembers.",
  },
  {
    corp: "BANDWIDTH x ALIGN 5",
    py: "x = 5",
    note: "Do we have the bandwidth for another variable? Great — declare and assign.",
  },
  {
    corp: "BANDWIDTH x",
    py: "x = None",
    note: "Reserve the headcount now, backfill the actual value later.",
  },
  {
    corp: "x ALIGN x + 1",
    py: "x = x + 1",
    note: "Re-align a value. ALIGN is = everywhere it appears in code.",
  },
  {
    corp: "PING value",
    py: "print(value)",
    note: "Ping the channel. Everyone sees it, nobody acts on it.",
  },
  {
    corp: "TOUCH BASE cond",
    py: "if cond:",
    note: "Quick sync — only go down this path if it's genuinely warranted.",
  },
  {
    corp: "OTHERWISE IF cond",
    py: "elif cond:",
    note: "Circling back with a different angle.",
  },
  {
    corp: "OTHERWISE",
    py: "else:",
    note: "Failing all of the above, here is the fallback plan.",
  },
  {
    corp: "CIRCLE BACK cond",
    py: "while cond:",
    note: "Keep revisiting this item until it somehow resolves itself.",
  },
  {
    corp: "FOR EACH i IN range(3)",
    py: "for i in range(3):",
    note: "Treat every item on the list as an action item.",
  },
  {
    corp: "TAKE THIS OFFLINE",
    py: "break",
    note: "Hard exit from the loop. This meeting is over.",
  },
  {
    corp: "HARD STOP",
    py: "break",
    note: "Same as TAKE THIS OFFLINE — someone has another call at the top of the hour.",
  },
  {
    corp: "SKIP AHEAD",
    py: "continue",
    note: "Park this one and move straight to the next item.",
  },
  {
    corp: "DELIVERABLE add(a, b)",
    py: "def add(a, b):",
    note: "Scope a reusable deliverable, with inputs.",
  },
  {
    corp: "CIRCLE BACK TO OFFICE a + b",
    py: "return a + b",
    note: "Report the outcome back up to stakeholders.",
  },
  {
    corp: "RISK",
    py: "try:",
    note: "Attempt something bold. What's the worst that could happen.",
  },
  {
    corp: "DAMAGE CONTROL Err AS e",
    py: "except Err as e:",
    note: "It happened. Spin up the war room. `AS e` and the error type are both optional.",
  },
  {
    corp: "RETRO",
    py: "finally:",
    note: "Runs no matter how it went. A blameless post-mortem. Lessons were learned.",
  },
  {
    corp: "ESCALATE err",
    py: "raise err",
    note: "Not my call to make — sending this one up the chain.",
  },
  {
    corp: "LOOP IN math AS m",
    py: "import math as m",
    note: "Add someone to the thread who actually knows this. `AS m` optional.",
  },
  {
    corp: "DEEP DIVE conn AS c",
    py: "with conn as c:",
    note: "Block off time with a resource; it's freed up the moment you're done.",
  },
  {
    corp: "NOTED",
    py: "pass",
    note: "Acknowledged. No action will be taken.",
  },
  {
    corp: "LOGGING OFF",
    py: "raise SystemExit",
    note: "It's EOD. Wrap the whole thing up, hard.",
  },
  {
    corp: "THANKS",
    py: "(removed)",
    note: "Optional email-style block-ender. Deleted before Python ever sees it.",
  },
  {
    corp: "a SYNERGY b",
    py: "a and b",
    note: "Both have to be true for the initiative to move forward.",
  },
  { corp: "LOCKED IN", py: "True", note: "Fully committed. It is happening." },
  { corp: "GHOSTED", py: "False", note: "No reply. Read it as a no." },
  {
    corp: "OUT OF OFFICE",
    py: "None",
    note: "Nobody's home. There is no value here.",
  },
];

/** Multi-word phrases first so the tokenizer matches the longest form. */
export const CORP_KEYWORDS = [
  "CIRCLE BACK TO OFFICE",
  "CIRCLE BACK",
  "FOR EACH",
  "TOUCH BASE",
  "OTHERWISE IF",
  "OTHERWISE",
  "TAKE THIS OFFLINE",
  "HARD STOP",
  "SKIP AHEAD",
  "DAMAGE CONTROL",
  "DEEP DIVE",
  "LOOP IN",
  "LOGGING OFF",
  "DELIVERABLE",
  "BANDWIDTH",
  "ESCALATE",
  "SYNERGY",
  "RISK",
  "RETRO",
  "NOTED",
  "ALIGN",
  "PING",
  "THANKS",
  "IN",
  "AS",
];

export const CORP_ATOMS = ["LOCKED IN", "GHOSTED", "OUT OF OFFICE"];
