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
    slug: "claude",
    label: "Claude & Anthropic",
    short: "Claude",
    accent: "#f97316",
    description: "Novedades de Claude, Anthropic, MCPs, skills y el ecosistema de agentes.",
  },
  {
    slug: "desarrollo",
    label: "Desarrollo con IA",
    short: "Desarrollo",
    accent: "#22d3ee",
    description: "SDKs, frameworks, repositorios y herramientas para desarrollar con IA.",
  },
  {
    slug: "herramientas",
    label: "Herramientas",
    short: "Herramientas",
    accent: "#a78bfa",
    description: "Nuevas apps, productos y servicios de IA.",
  },
  {
    slug: "noticias",
    label: "Noticias",
    short: "Noticias",
    accent: "#60a5fa",
    description: "Actualidad general del sector de la inteligencia artificial.",
  },
  {
    slug: "cambios",
    label: "Cambios & Releases",
    short: "Cambios",
    accent: "#34d399",
    description: "Changelogs, actualizaciones y deprecaciones de modelos y servicios.",
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
  return CATEGORIES.filter(
    (c): c is CategoryMeta & { slug: CategorySlug } => c.slug !== "breaking",
  );
}
