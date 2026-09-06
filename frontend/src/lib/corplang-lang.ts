import { StreamLanguage } from "@codemirror/language";

import { CORP_ATOMS, CORP_KEYWORDS } from "./keywords";

const KEYWORD_RES = CORP_KEYWORDS.map(
  (k) => new RegExp("^" + k.replace(/ /g, "\\s+") + "\\b"),
);

/**
 * Minimal stream tokenizer so the editor can colour CorpLang. It mirrors the
 * transpiler's vocabulary but does no real parsing.
 */
export function corplang() {
  return StreamLanguage.define<{}>({
    name: "corplang",
    startState: () => ({}),
    token(stream) {
      if (stream.eatSpace()) return null;

      // line comment
      if (stream.match(/^--.*/)) return "comment";

      // strings
      if (stream.match(/^"(?:[^"\\]|\\.)*"?/)) return "string";
      if (stream.match(/^'(?:[^'\\]|\\.)*'?/)) return "string";

      // corporate literals: LOCKED IN / GHOSTED / OUT OF OFFICE
      for (const atom of CORP_ATOMS) {
        if (stream.match(new RegExp("^" + atom.replace(/ /g, "\\s+") + "\\b"))) {
          return "atom";
        }
      }

      // keywords
      for (const re of KEYWORD_RES) {
        if (stream.match(re)) return "keyword";
      }

      if (stream.match(/^\d+(?:\.\d+)?/)) return "number";
      if (stream.match(/^[A-Za-z_]\w*/)) return "variableName";

      stream.next();
      return null;
    },
    languageData: {
      commentTokens: { line: "--" },
    },
  });
}
