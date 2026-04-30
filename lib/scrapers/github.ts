import type { Article } from "../types";

const TOPICS = ["ai", "llm", "agents", "mcp", "rag", "embeddings"];
const GITHUB_API = "https://api.github.com";

type GhRepo = {
  id: number;
  full_name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  created_at: string;
  updated_at: string;
  owner: { avatar_url: string };
};

async function searchTopic(
  topic: string,
  token?: string,
): Promise<Omit<Article, "id">[]> {
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);
  const url = `${GITHUB_API}/search/repositories?q=topic:${topic}+created:>${since}&sort=stars&order=desc&per_page=10`;

  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "noticieroIA/1.0",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  try {
    const res = await fetch(url, { headers, next: { revalidate: 0 } });
    if (!res.ok) return [];
    const json = await res.json();
    const repos: GhRepo[] = json?.items ?? [];

    return repos.map((r) => ({
      title: `${r.full_name} · ${r.stargazers_count.toLocaleString("es-ES")} ⭐`,
      summary:
        r.description ??
        `Nuevo repositorio de ${topic.toUpperCase()} con ${r.stargazers_count} estrellas.`,
      content: null,
      imageUrl: r.owner.avatar_url ?? null,
      source: "github" as const,
      sourceName: r.full_name,
      sourceUrl: r.html_url,
      category: "tools" as const,
      publishedAt: r.created_at,
    }));
  } catch {
    return [];
  }
}

export async function scrapeGitHub(token?: string): Promise<Omit<Article, "id">[]> {
  const results = await Promise.allSettled(
    TOPICS.map((t) => searchTopic(t, token)),
  );
  const all = results.flatMap((r) =>
    r.status === "fulfilled" ? r.value : [],
  );
  const seen = new Set<string>();
  return all.filter((a) => {
    if (seen.has(a.sourceUrl)) return false;
    seen.add(a.sourceUrl);
    return true;
  });
}
