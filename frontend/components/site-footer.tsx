export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-6 text-sm text-muted sm:flex-row sm:px-6">
        <p>CorpLang — a toy language. Corporate jargon in, Python out.</p>
        <p>
          &copy; {year}{" "}
          <a
            href="https://github.com/parinayseth"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground hover:underline"
          >
            parinayseth
          </a>
          . Built with Next.js &amp; FastAPI.
        </p>
      </div>
    </footer>
  );
}
