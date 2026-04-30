import Parser from "rss-parser";
import type { Article, CategorySlug } from "../types";

const parser = new Parser({ timeout: 10_000 });

export type FeedConfig = {
  url: string;
  sourceName: string;
  defaultCategory: CategorySlug;
};

export const RSS_FEEDS: FeedConfig[] = [
  {
    url: "https://www.anthropic.com/news/rss.xml",
    sourceName: "Anthropic News",
    defaultCategory: "changes",
  },
  {
    url: "https://openai.com/blog/rss.xml",
    sourceName: "OpenAI Blog",
    defaultCategory: "news",
  },
  {
    url: "https://blog.google/technology/ai/rss/",
    sourceName: "Google AI Blog",
    defaultCategory: "news",
  },
  {
    url: "https://www.theverge.com/ai-artificial-intelligence/rss/index.xml",
    sourceName: "The Verge AI",
    defaultCategory: "news",
  },
  {
    url: "https://techcrunch.com/category/artificial-intelligence/feed/",
    sourceName: "TechCrunch AI",
    defaultCategory: "news",
  },
  {
    url: "https://hnrss.org/frontpage",
    sourceName: "Hacker News",
    defaultCategory: "news",
  },
  {
    url: "http://export.arxiv.org/rss/cs.AI",
    sourceName: "arXiv cs.AI",
    defaultCategory: "new",
  },
];

function extractImage(item: Parser.Item & Record<string, unknown>): string | null {
  if (item["media:content"] && typeof item["media:content"] === "object") {
    const mc = item["media:content"] as Record<string, unknown>;
    if (typeof mc["$"] === "object") {
      const attrs = mc["$"] as Record<string, string>;
      if (attrs.url) return attrs.url;
    }
  }
  if (item.enclosure?.url) return item.enclosure.url;
  const content = (item["content:encoded"] ?? item.content ?? "") as string;
  const m = content.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (m) return m[1];
  return null;
}

function summarize(item: Parser.Item & Record<string, unknown>): string {
  const raw =
    ((item["content:encoded"] ?? item.content ?? item.summary ?? "") as string)
      .replace(/<[^>]*>/g, "")
      .replace(/\s+/g, " ")
      .trim();
  return raw.slice(0, 280) + (raw.length > 280 ? "…" : "");
}

export async function scrapeRssFeed(
  feed: FeedConfig,
): Promise<Omit<Article, "id">[]> {
  try {
    const result = await parser.parseURL(feed.url);
    return (result.items ?? []).slice(0, 20).map((item) => ({
      title: (item.title ?? "Sin título").trim(),
      summary: summarize(item as Parser.Item & Record<string, unknown>),
      content: null,
      imageUrl: extractImage(item as Parser.Item & Record<string, unknown>),
      source: "rss" as const,
      sourceName: feed.sourceName,
      sourceUrl: item.link ?? item.guid ?? "",
      category: feed.defaultCategory,
      publishedAt: item.isoDate ?? item.pubDate ?? new Date().toISOString(),
    }));
  } catch {
    return [];
  }
}

export async function scrapeAllRss(): Promise<Omit<Article, "id">[]> {
  const results = await Promise.allSettled(
    RSS_FEEDS.map((f) => scrapeRssFeed(f)),
  );
  return results
    .flatMap((r) => (r.status === "fulfilled" ? r.value : []))
    .filter((a) => a.sourceUrl);
}
