import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BookOpen, ExternalLink } from "lucide-react";
import { getArticleById } from "@/lib/articles";
import { fetchArticleContent } from "@/lib/fetch-content";
import { translateContent } from "@/lib/translator";
import { CategoryBadge } from "@/components/category-badge";
import { SourceBadge } from "@/components/source-badge";
import { timeAgo } from "@/lib/format";

export const dynamic = "force-dynamic";

function ArticleContent({ content }: { content: string }) {
  const blocks = content
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter((b) => b.length > 10);

  return (
    <div className="space-y-5 text-base leading-8 text-foreground/85">
      {blocks.map((block, i) => {
        // Bullet group
        if (block.includes("\n") && block.split("\n").every((l) => l.startsWith("•") || l.trim() === "")) {
          const items = block.split("\n").filter((l) => l.trim().startsWith("•"));
          return (
            <ul key={i} className="space-y-2 pl-1">
              {items.map((item, j) => (
                <li key={j} className="flex gap-3">
                  <span className="mt-3 h-1 w-1 shrink-0 rounded-full bg-foreground-muted" />
                  <span>{item.replace(/^•\s*/, "")}</span>
                </li>
              ))}
            </ul>
          );
        }

        // Single bullet line
        if (block.startsWith("•")) {
          return (
            <ul key={i} className="space-y-2 pl-1">
              {block.split("\n").filter((l) => l.trim()).map((item, j) => (
                <li key={j} className="flex gap-3">
                  <span className="mt-3 h-1 w-1 shrink-0 rounded-full bg-foreground-muted" />
                  <span>{item.replace(/^•\s*/, "")}</span>
                </li>
              ))}
            </ul>
          );
        }

        // Short line that looks like a section heading (< 80 chars, no period at end)
        if (block.length < 80 && !block.endsWith(".") && !block.endsWith(",")) {
          return (
            <h2 key={i} className="pt-2 text-lg font-semibold text-foreground">
              {block}
            </h2>
          );
        }

        return <p key={i}>{block}</p>;
      })}
    </div>
  );
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = await getArticleById(id);
  if (!article) notFound();

  const [contentResult] = await Promise.all([
    fetchArticleContent(article.sourceUrl, process.env.GITHUB_TOKEN),
  ]);

  let displayContent: string | null = null;
  let truncated = false;

  if (contentResult.type !== "empty") {
    const raw = contentResult.content;
    truncated = raw.length > 5000;
    displayContent = await translateContent(raw);
  }

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 -z-10 bg-aurora opacity-40" aria-hidden />

      {/* Hero image */}
      {article.imageUrl && (
        <div className="relative h-64 w-full overflow-hidden md:h-96">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={article.imageUrl}
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/60 to-background" />
        </div>
      )}

      <div className="mx-auto max-w-3xl px-5 pb-24 pt-8 md:px-8">
        {/* Back */}
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-foreground-muted transition hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver
        </Link>

        {/* Meta */}
        <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2">
          <CategoryBadge slug={article.category} />
          <SourceBadge source={article.source} sourceName={article.sourceName} />
          <span className="text-[11px] uppercase tracking-[0.14em] text-foreground-faint">
            {timeAgo(article.publishedAt)}
          </span>
        </div>

        {/* Title */}
        <h1 className="mb-4 text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
          {article.title}
        </h1>

        {/* Summary */}
        <p className="mb-10 text-lg text-foreground-muted">{article.summary}</p>

        {/* Content */}
        <div className="border-t border-border pt-8">
          {displayContent ? (
            <div>
              <div className="mb-6 flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-foreground-faint">
                <BookOpen className="h-3.5 w-3.5" />
                {contentResult.type === "readme"
                  ? "README del repositorio"
                  : "Artículo completo"}
                {truncated && (
                  <span className="ml-1 normal-case">(extracto)</span>
                )}
              </div>
              <ArticleContent content={displayContent} />
            </div>
          ) : (
            <p className="py-4 text-sm text-foreground-faint">
              No se pudo cargar el contenido completo. Visita la fuente para leerlo.
            </p>
          )}
        </div>

        {/* Source link */}
        <div className="mt-12 flex items-center justify-between border-t border-border pt-6">
          <span className="text-sm text-foreground-faint">Fuente original</span>
          <a
            href={article.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-border-strong bg-surface px-4 py-2 text-sm font-medium transition hover:bg-surface-hover"
          >
            {article.sourceName}
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
