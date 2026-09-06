#!/usr/bin/env python3
"""
CorpLang — a fun, tiny corporate-jargon programming language.

It transpiles line-by-line into Python, reusing Python's own indentation
rules for blocks (so there's no need for "end"/"THANKS" block-closers —
just indent like you would in Python).

Run a .corp file:
    python3 corplang.py myscript.corp

Or just see the generated Python without running it:
    python3 corplang.py myscript.corp --show
"""

import re
import sys

# ---------------------------------------------------------------------------
# Keyword -> Python translation rules.
#
# LINE_RULES rewrite a whole line and are anchored at its start. They run
# first, in order, so longer / more specific patterns must come first.
#
# CODE_RULES swap a single token wherever it appears (ALIGN -> =, SYNERGY ->
# and, ...). They must NOT touch text inside a string literal or after a "#"
# comment, so they are applied by _apply_code_rules() rather than a plain
# re.sub over the line.
# ---------------------------------------------------------------------------

LINE_RULES = [
    # comments
    (r'^(\s*)--(.*)$',                                       r'\1#\2'),

    # function definition:  DELIVERABLE name(a, b)
    (r'^(\s*)DELIVERABLE\s+(\w+)\s*\((.*)\)\s*:?$',          r'\1def \2(\3):'),

    # return:               CIRCLE BACK TO OFFICE <expr>
    (r'^(\s*)CIRCLE\s+BACK\s+TO\s+OFFICE\s*(.*)$',           r'\1return \2'),

    # while loop:           CIRCLE BACK <condition>
    (r'^(\s*)CIRCLE\s+BACK\s+(.*)$',                         r'\1while \2:'),

    # for-each loop:        FOR EACH x IN range(10)
    (r'^(\s*)FOR\s+EACH\s+(\w+)\s+IN\s+(.*)$',               r'\1for \2 in \3:'),

    # if / elif / else
    (r'^(\s*)TOUCH\s+BASE\s+(.*)$',                          r'\1if \2:'),
    (r'^(\s*)OTHERWISE\s+IF\s+(.*)$',                        r'\1elif \2:'),
    (r'^(\s*)OTHERWISE\s*:?$',                               r'\1else:'),

    # try / except / finally / raise — corporate incident response
    (r'^(\s*)RISK\s*:?$',                                    r'\1try:'),
    (r'^(\s*)DAMAGE\s+CONTROL\s+(.+?)\s+AS\s+(\w+)\s*$',     r'\1except \2 as \3:'),
    (r'^(\s*)DAMAGE\s+CONTROL\s+(.+?)\s*$',                  r'\1except \2:'),
    (r'^(\s*)DAMAGE\s+CONTROL\s*$',                          r'\1except:'),
    (r'^(\s*)RETRO\s*:?$',                                   r'\1finally:'),
    (r'^(\s*)ESCALATE\s*(.*)$',                              r'\1raise \2'),

    # imports / context managers
    (r'^(\s*)LOOP\s+IN\s+([\w.]+)\s+AS\s+(\w+)\s*$',         r'\1import \2 as \3'),
    (r'^(\s*)LOOP\s+IN\s+([\w.]+)\s*$',                      r'\1import \2'),
    (r'^(\s*)DEEP\s+DIVE\s+(.+?)\s+AS\s+(\w+)\s*$',          r'\1with \2 as \3:'),
    (r'^(\s*)DEEP\s+DIVE\s+(.+?)\s*$',                       r'\1with \2:'),

    # break / continue / pass / exit
    (r'^(\s*)TAKE\s+THIS\s+OFFLINE\s*$',                     r'\1break'),
    (r'^(\s*)HARD\s+STOP\s*$',                               r'\1break'),
    (r'^(\s*)SKIP\s+AHEAD\s*$',                              r'\1continue'),
    (r'^(\s*)NOTED\s*$',                                     r'\1pass'),
    (r'^(\s*)LOGGING\s+OFF\s*$',                             r'\1raise SystemExit'),

    # print
    (r'^(\s*)PING\s+(.*)$',                                  r'\1print(\2)'),

    # variable declare + assign:  BANDWIDTH x ALIGN 5
    (r'^(\s*)BANDWIDTH\s+(\w+)\s+ALIGN\s+(.*)$',             r'\1\2 = \3'),
    # bare declare:               BANDWIDTH x
    (r'^(\s*)BANDWIDTH\s+(\w+)\s*$',                         r'\1\2 = None'),

    # THANKS is just a block-closer marker for humans; Python doesn't need it
    (r'^(\s*)THANKS\s*$',                                    r''),
]

CODE_RULES = [
    # reassignment anywhere:  x ALIGN x + 1
    (r'\bALIGN\b',                                           r'='),
    # boolean AND, corporate style:  ready SYNERGY approved
    (r'\bSYNERGY\b',                                         r'and'),
    # booleans / null
    (r'\bLOCKED\s+IN\b',                                     r'True'),
    (r'\bGHOSTED\b',                                         r'False'),
    (r'\bOUT\s+OF\s+OFFICE\b',                               r'None'),
]

# A single-line Python string literal, including any r/b/f/u prefix.
_STRING_RE = re.compile(
    r'''[rRbBfFuU]{0,3}(?:"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*')'''
)


def _code_sub(fragment: str) -> str:
    for pattern, repl in CODE_RULES:
        fragment = re.sub(pattern, repl, fragment)
    return fragment


def _apply_code_rules(line: str) -> str:
    """Apply CODE_RULES to code only — skip string literals and the tail of
    the line once an unquoted '#' comment marker is reached."""
    out = []
    pos = 0
    for m in _STRING_RE.finditer(line):
        gap = line[pos:m.start()]
        hash_at = gap.find('#')
        if hash_at != -1:
            # everything from '#' on is a comment — leave it verbatim
            out.append(_code_sub(gap[:hash_at]))
            out.append(gap[hash_at:])
            out.append(line[m.start():])
            return ''.join(out)
        out.append(_code_sub(gap))
        out.append(m.group(0))          # string literal, untouched
        pos = m.end()
    tail = line[pos:]
    hash_at = tail.find('#')
    if hash_at != -1:
        out.append(_code_sub(tail[:hash_at]))
        out.append(tail[hash_at:])
    else:
        out.append(_code_sub(tail))
    return ''.join(out)


def transpile(source: str) -> str:
    out = []
    for line in source.splitlines():
        for pattern, repl in LINE_RULES:
            line = re.sub(pattern, repl, line)
        line = _apply_code_rules(line)
        out.append(line)
    # keep blank lines (incl. those left by a removed THANKS); drop only
    # lines that ended up as stray whitespace
    return "\n".join(l for l in out if l.strip() != "" or l == "")

def run(path: str, show: bool = False):
    with open(path) as f:
        source = f.read()
    py_code = transpile(source)
    if show:
        print("---- generated Python ----")
        print(py_code)
        print("---------------------------")
    exec(compile(py_code, path, "exec"), {"__name__": "__main__"})

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("usage: python3 corplang.py <file.corp> [--show]")
        sys.exit(1)
    run(sys.argv[1], show="--show" in sys.argv)
