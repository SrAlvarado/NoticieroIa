import type { Article } from "../types";

const SUBREDDITS = [
  "LocalLLaMA",
  "artificial",
  "singularity",
  "ClaudeAI",
  "OpenAI",
  "MachineLearning",
];

const UA = "noticieroIA/1.0 (+https://github.com/SrAlvarado/NoticieroIa)";

type RedditPost = {
  data: {
    id: string;
    title: string;
    selftext: string;
    url: string;
    permalink: string;
    thumbnail: string;
    preview?: { images: Array<{ source: { url: string } }> };
    created_utc: number;
    subreddit: string;
    score: number;
  };
};

function extractImage(post: RedditPost["data"]): string | null {
  const src = post.preview?.images?.[0]?.source?.url;
  if (src) return src.replace(/&amp;/g, "&");
  if (
    post.thumbnail &&
    post.thumbnail !== "self" &&
    post.thumbnail !== "default" &&
    post.thumbnail.startsWith("http")
  ) {
    return post.thumbnail;
  }
  return null;
}

async function scrapeSubreddit(sub: string): Promise<Omit<Article, "id">[]> {
  try {
    const res = await fetch(
      `https://www.reddit.com/r/${sub}/new.json?limit=25`,
      {
        headers: { "User-Agent": UA },
        next: { revalidate: 0 },
      },
    );
    if (!res.ok) return [];
    const json = await res.json();
    const posts: RedditPost[] = json?.data?.children ?? [];
    return posts
      .filter((p) => p.data.score > 5)
      .map((p) => ({
        title: p.data.title.trim(),
        summary:
          (p.data.selftext.slice(0, 280) || p.data.title) +
          (p.data.selftext.length > 280 ? "…" : ""),
        content: p.data.selftext || null,
        imageUrl: extractImage(p.data),
        source: "reddit" as const,
        sourceName: `r/${p.data.subreddit}`,
        sourceUrl: `https://reddit.com${p.data.permalink}`,
        category: "noticias" as const,
        publishedAt: new Date(p.data.created_utc * 1000).toISOString(),
      }));
  } catch {
    return [];
  }
}

export async function scrapeReddit(): Promise<Omit<Article, "id">[]> {
  const results = await Promise.allSettled(
    SUBREDDITS.map((s) => scrapeSubreddit(s)),
  );
  return results
    .flatMap((r) => (r.status === "fulfilled" ? r.value : []))
    .filter((a) => a.sourceUrl);
}
