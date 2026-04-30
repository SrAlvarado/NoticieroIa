import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { NewsCard } from "@/components/news-card";
import { CATEGORIES, getCategory, isBreaking } from "@/lib/categories";
import { getArticles } from "@/lib/articles";
import type { CategorySlug } from "@/lib/types";

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }));
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  const all = await getArticles();
  const articles =
    category.slug === "breaking"
      ? all.filter((a) => isBreaking(a.publishedAt))
      : all.filter((a) => a.category === (category.slug as CategorySlug));

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 md:px-8 md:py-20">
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-foreground-muted transition hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Inicio
      </Link>

      <div className="mb-10">
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
        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
          {category.label}
        </h1>
        <p className="mt-3 max-w-xl text-foreground-muted md:text-lg">
          {category.description}
        </p>
      </div>

      {articles.length === 0 ? (
        <p className="text-foreground-muted">
          Aún no hay artículos en esta categoría. Vuelve dentro de un par de
          horas.
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {articles.map((a, i) => (
            <NewsCard key={a.id} article={a} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
