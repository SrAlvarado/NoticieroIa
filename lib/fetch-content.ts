import { extract } from "@extractus/article-extractor";

export type ContentResult =
  | { type: "readme"; content: string }
  | { type: "article"; content: string }
  | { type: "empty" };

export function isGitHubRepo(url: string): boolean {
  try {
    const u = new URL(url);
    return (
      u.hostname === "github.com" &&
      u.pathname.split("/").filter(Boolean).length === 2
    );
  } catch {
    return false;
  }
}

export async function fetchGitHubReadme(
  repoUrl: string,
  token?: string,
): Promise<string | null> {
  try {
    const parts = new URL(repoUrl).pathname.split("/").filter(Boolean);
    const [owner, repo] = parts;
    const headers: Record<string, string> = {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "noticieroIA/1.0",
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const res = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/readme`,
      { headers },
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.content) return null;
    return Buffer.from(data.content, "base64").toString("utf-8");
  } catch {
    return null;
  }
}

export function markdownToText(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`]+`/g, (m) => m.slice(1, -1))
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/!\[.*?\]\(.*?\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^\s*[-*+]\s+/gm, "• ")
    .replace(/^\s*\d+\.\s+/gm, "")
    .replace(/[*_]{1,2}([^*_]+)[*_]{1,2}/g, "$1")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export async function fetchArticleContent(
  url: string,
  githubToken?: string,
): Promise<ContentResult> {
  try {
    if (isGitHubRepo(url)) {
      const readme = await fetchGitHubReadme(url, githubToken);
      if (readme) return { type: "readme", content: markdownToText(readme) };
      return { type: "empty" };
    }

    const article = await extract(url, { wordsPerMinute: 300 });
    if (!article) return { type: "empty" };

    const text = (article.content ?? "")
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    if (!text) return { type: "empty" };
    return { type: "article", content: text };
  } catch {
    return { type: "empty" };
  }
}
