import type { Article } from "../types";

// Primarios: Claude/Anthropic/MCP/agentes
const PRIMARY_KEYWORDS = [
  "claude",
  "anthropic",
  "mcp",
  "model-context-protocol",
  "claude-code",
  "claude-api",
  "anthropic-sdk",
  "mcp-server",
  "claude-skill",
  "gemini-flash",
];
// Secundarios: desarrollo con IA, buenas prácticas, clean code
const DEV_TOPICS = [
  "llm",
  "ai-agents",
  "ai-sdk",
  "langchain",
  "openai",
  "clean-code",
  "software-engineering",
  "best-practices",
  "design-patterns",
  "refactoring",
];

const GITHUB_API = "https://api.github.com";

type GhRepo = {
  id: number;
  full_name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  created_at: string;
  owner: { avatar_url: string };
};

async function searchKeyword(
  keyword: string,
  category: Article["category"],
  token?: string,
): Promise<Omit<Article, "id">[]> {
  const since = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);
  // Remove topic: restriction to search in name, description, and readme
  const url = `${GITHUB_API}/search/repositories?q=${keyword}+created:>${since}&sort=stars&order=desc&per_page=8`;

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
        `Nuevo repositorio sobre ${keyword} con ${r.stargazers_count} estrellas en GitHub.`,
      content: null,
      imageUrl: r.owner.avatar_url ?? null,
      source: "github" as const,
      sourceName: r.full_name,
      sourceUrl: r.html_url,
      category,
      publishedAt: r.created_at,
    }));
  } catch {
    return [];
  }
}

export async function scrapeGitHub(token?: string): Promise<Omit<Article, "id">[]> {
  const [primaryResults, devResults] = await Promise.allSettled([
    Promise.allSettled(
      PRIMARY_KEYWORDS.map((k) => searchKeyword(k, "claude", token)),
    ),
    Promise.allSettled(
      DEV_TOPICS.map((k) => searchKeyword(k, "desarrollo", token)),
    ),
  ]);

  const all = [
    ...(primaryResults.status === "fulfilled"
      ? primaryResults.value.flatMap((r) => (r.status === "fulfilled" ? r.value : []))
      : []),
    ...(devResults.status === "fulfilled"
      ? devResults.value.flatMap((r) => (r.status === "fulfilled" ? r.value : []))
      : []),
  ];

  const seen = new Set<string>();
  return all.filter((a) => {
    if (seen.has(a.sourceUrl)) return false;
    seen.add(a.sourceUrl);
    return true;
  });
}
