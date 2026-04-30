import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { NewsCard } from "./news-card";
import type { Article, CategoryMeta } from "@/lib/types";

export function CategorySection({
  category,
  articles,
}: {
  category: CategoryMeta;
  articles: Article[];
}) {
  if (articles.length === 0) return null;
  const visible = articles.slice(0, 6);

  return (
    <section id={category.slug} className="border-t border-border">
      <div className="mx-auto max-w-7xl px-5 py-14 md:px-8 md:py-20">
        <div className="mb-8 flex items-end justify-between gap-6">
          <div>
            <div
              className="mb-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.18em]"
              style={{
                borderColor: `${category.accent}55`,
                color: category.accent,
                background: `${category.accent}10`,
              }}
            >
              <span
                className="inline-block h-1.5 w-1.5 rounded-full"
                style={{ background: category.accent }}
              />
              {category.short}
            </div>
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
              {category.label}
            </h2>
            <p className="mt-2 max-w-xl text-foreground-muted">
              {category.description}
            </p>
          </div>

          <Link
            href={`/category/${category.slug}`}
            className="hidden items-center gap-1.5 rounded-full border border-border-strong bg-surface px-4 py-2 text-sm font-medium text-foreground-muted transition hover:bg-surface-hover hover:text-foreground md:inline-flex"
          >
            Ver todo
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {visible.map((a, i) => (
            <NewsCard key={a.id} article={a} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
