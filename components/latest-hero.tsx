import { NewsCard } from "./news-card";
import type { Article } from "@/lib/types";

export function LatestHero({ articles }: { articles: Article[] }) {
  if (articles.length === 0) {
    return (
      <section className="relative border-b border-border">
        <div className="absolute inset-0 -z-10 bg-aurora" aria-hidden />
        <div className="absolute inset-0 -z-10 bg-grid" aria-hidden />
        <div className="mx-auto max-w-7xl px-5 pb-16 pt-20 md:px-8 md:pt-28">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border-strong bg-surface px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-foreground-muted">
            <span className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-rose-400" />
            Última hora
          </div>
          <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
            Tu radar de <span className="text-gradient">IA</span> está listo.
          </h1>
          <p className="mt-3 max-w-xl text-foreground-muted md:text-lg">
            Las primeras noticias llegarán en el próximo ciclo del cron (cada 2 horas).
          </p>
        </div>
      </section>
    );
  }
  const [primary, ...rest] = articles;
  const secondary = rest.slice(0, 4);

  return (
    <section id="breaking" className="relative">
      <div className="absolute inset-0 -z-10 bg-aurora" aria-hidden />
      <div className="absolute inset-0 -z-10 bg-grid" aria-hidden />

      <div className="mx-auto max-w-7xl px-5 pb-12 pt-16 md:px-8 md:pb-16 md:pt-24">
        <div className="mb-8 flex items-end justify-between gap-6">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border-strong bg-surface px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-foreground-muted">
              <span className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-rose-400" />
              Última hora
            </div>
            <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
              Lo que está pasando ahora mismo en{" "}
              <span className="text-gradient">IA</span>.
            </h1>
            <p className="mt-3 max-w-xl text-foreground-muted md:text-lg">
              Recopilado automáticamente cada 2 horas desde RSS, Reddit, GitHub
              y la red social del momento.
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3 md:gap-6">
          <div className="md:col-span-2">
            <NewsCard article={primary} variant="feature" index={0} />
          </div>
          <div className="grid gap-4 md:gap-6">
            {secondary.slice(0, 2).map((a, i) => (
              <NewsCard key={a.id} article={a} variant="compact" index={i + 1} />
            ))}
          </div>
        </div>

        {secondary.length > 2 && (
          <div className="mt-4 grid gap-4 md:mt-6 md:grid-cols-3 md:gap-6">
            {secondary.slice(2).map((a, i) => (
              <NewsCard key={a.id} article={a} index={i + 3} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
