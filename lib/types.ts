export type CategorySlug = "claude" | "desarrollo" | "herramientas" | "noticias" | "cambios";

export type SourceKind = "rss" | "reddit" | "github" | "twitter" | "mastodon";

export type Article = {
  id: string;
  title: string;
  summary: string;
  content?: string | null;
  imageUrl: string | null;
  source: SourceKind;
  sourceName: string;
  sourceUrl: string;
  category: CategorySlug;
  publishedAt: string;
};

export type CategoryMeta = {
  slug: CategorySlug | "breaking";
  label: string;
  short: string;
  accent: string;
  description: string;
};
