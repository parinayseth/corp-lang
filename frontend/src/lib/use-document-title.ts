import { useEffect } from "react";

const SUFFIX = "CorpLang";
const DEFAULT_TITLE = "CorpLang — code that talks like your standup";

/**
 * Sets document.title for a route. Pass a bare page name ("Compiler") to get
 * "Compiler · CorpLang"; pass nothing for the site default.
 */
export function useDocumentTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} · ${SUFFIX}` : DEFAULT_TITLE;
  }, [title]);
}
