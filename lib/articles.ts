import { MOCK_ARTICLES } from "./mock-articles";
import { isBreaking } from "./categories";
import { isSupabaseConfigured, getSupabaseServer } from "./supabase/server";
import type { Article, CategorySlug } from "./types";

type DbRow = {
  id: string;
  title: string;
  summary: string;
  content: string | null;
  image_url: string | null;
  source: string;
  source_name: string;
  source_url: string;
  category: string;
  published_at: string;
};

function rowToArticle(row: DbRow): Article {
  return {
    id: row.id,
    title: row.title,
    summary: row.summary,
    content: row.content,
    imageUrl: row.image_url,
    source: row.source as Article["source"],
    sourceName: row.source_name,
    sourceUrl: row.source_url,
    category: row.category as CategorySlug,
    publishedAt: row.published_at,
  };
}

export async function getArticles(): Promise<Article[]> {
  if (!isSupabaseConfigured()) {
    return [...MOCK_ARTICLES].sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );
  }
  const sb = getSupabaseServer();
  const { data, error } = await sb
    .from("articles")
    .select("*")
    .order("published_at", { ascending: false })
    .limit(200);

  if (error || !data) return MOCK_ARTICLES;
  return (data as DbRow[]).map(rowToArticle);
}

export async function getArticlesByCategory(slug: CategorySlug): Promise<Article[]> {
  if (!isSupabaseConfigured()) {
    return MOCK_ARTICLES.filter((a) => a.category === slug);
  }
  const sb = getSupabaseServer();
  const { data, error } = await sb
    .from("articles")
    .select("*")
    .eq("category", slug)
    .order("published_at", { ascending: false })
    .limit(100);

  if (error || !data) return MOCK_ARTICLES.filter((a) => a.category === slug);
  return (data as DbRow[]).map(rowToArticle);
}

export async function getBreakingArticles(): Promise<Article[]> {
  if (!isSupabaseConfigured()) {
    return MOCK_ARTICLES.filter((a) => isBreaking(a.publishedAt));
  }
  const sb = getSupabaseServer();
  const cutoff = new Date(
    Date.now() - 4 * 60 * 60 * 1000,
  ).toISOString();
  const { data, error } = await sb
    .from("articles")
    .select("*")
    .gte("published_at", cutoff)
    .order("published_at", { ascending: false })
    .limit(10);

  if (error || !data) return MOCK_ARTICLES.filter((a) => isBreaking(a.publishedAt));
  return (data as DbRow[]).map(rowToArticle);
}

export async function getArticleById(id: string): Promise<Article | null> {
  if (!isSupabaseConfigured()) {
    return MOCK_ARTICLES.find((a) => a.id === id) ?? null;
  }
  const sb = getSupabaseServer();
  const { data, error } = await sb
    .from("articles")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return rowToArticle(data as DbRow);
}
