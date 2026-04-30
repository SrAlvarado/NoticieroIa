import type { CategoryMeta, CategorySlug } from "./types";

export const BREAKING_HOURS = 4;

export const CATEGORIES: readonly CategoryMeta[] = [
  {
    slug: "breaking",
    label: "Última hora",
    short: "Última hora",
    accent: "#ef4444",
    description: `Lo más reciente de las últimas ${BREAKING_HOURS} horas.`,
  },
  {
    slug: "tools",
    label: "Herramientas",
    short: "Herramientas",
    accent: "#22d3ee",
    description: "Nuevos lanzamientos, productos y repositorios de IA.",
  },
  {
    slug: "news",
    label: "Noticias",
    short: "Noticias",
    accent: "#a78bfa",
    description: "Actualidad general del sector.",
  },
  {
    slug: "changes",
    label: "Cambios",
    short: "Cambios",
    accent: "#f59e0b",
    description: "Changelogs y actualizaciones de modelos.",
  },
  {
    slug: "new",
    label: "Nuevo",
    short: "Nuevo",
    accent: "#34d399",
    description: "Tendencias emergentes: MCPs, frameworks, paradigmas.",
  },
] as const;

export const CATEGORY_BY_SLUG: Record<string, CategoryMeta> = Object.fromEntries(
  CATEGORIES.map((c) => [c.slug, c]),
);

export function getCategory(slug: string): CategoryMeta | undefined {
  return CATEGORY_BY_SLUG[slug];
}

export function isBreaking(publishedAt: string): boolean {
  const ageMs = Date.now() - new Date(publishedAt).getTime();
  return ageMs <= BREAKING_HOURS * 60 * 60 * 1000;
}

export function nonBreakingCategories(): CategoryMeta[] {
  return CATEGORIES.filter((c): c is CategoryMeta & { slug: CategorySlug } => c.slug !== "breaking");
}
