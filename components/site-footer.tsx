import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-5 py-10 text-sm text-foreground-muted md:flex-row md:items-center md:px-8">
        <div className="flex items-center gap-3">
          <span className="font-semibold tracking-tight text-foreground">
            Noticiero<span className="text-gradient">IA</span>
          </span>
          <span className="text-foreground-faint">·</span>
          <span>Agregador personal · actualizado cada 2 h</span>
        </div>

        <div className="flex items-center gap-5">
          <Link
            href="https://github.com/SrAlvarado/NoticieroIa"
            className="hover:text-foreground"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </Link>
          <Link href="/#breaking" className="hover:text-foreground">
            Última hora
          </Link>
        </div>
      </div>
    </footer>
  );
}
