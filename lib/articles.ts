import { MOCK_ARTICLES } from "./mock-articles";
import { isBreaking } from "./categories";
import type { Article, CategorySlug } from "./types";

export async function getArticles(): Promise<Article[]> {
  return [...MOCK_ARTICLES].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

export async function getArticlesByCategory(slug: CategorySlug): Promise<Article[]> {
  const all = await getArticles();
  return all.filter((a) => a.category === slug);
}

export async function getBreakingArticles(): Promise<Article[]> {
  const all = await getArticles();
  return all.filter((a) => isBreaking(a.publishedAt));
}

export async function getArticleById(id: string): Promise<Article | null> {
  const all = await getArticles();
  return all.find((a) => a.id === id) ?? null;
}
