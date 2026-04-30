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
  const cleaned = md
    // HTML comments
    .replace(/<!--[\s\S]*?-->/g, "")
    // HTML tags (img, badges, etc.)
    .replace(/<[^>]*>/g, "")
    // Badge combo links [![...](...)](#)
    .replace(/\[!\[[^\]]*\]\([^)]*\)\]\([^)]*\)/g, "")
    // Image markdown
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    // Empty links [](URL)
    .replace(/\[\]\([^)]*\)/g, "")
    // Code blocks
    .replace(/```[\s\S]*?```/g, "")
    // Inline code — keep text
    .replace(/`([^`\n]+)`/g, "$1")
    // Headings — keep text as a section separator
    .replace(/^#{1,6}\s+(.+)$/gm, "\n$1\n")
    // Links — keep link text
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    // Reference links [text][ref] → text
    .replace(/\[([^\]]+)\]\[[^\]]*\]/g, "$1")
    // Bold / italic
    .replace(/\*{1,3}([^*\n]+)\*{1,3}/g, "$1")
    .replace(/_{1,3}([^_\n]+)_{1,3}/g, "$1")
    // Blockquotes
    .replace(/^>\s*/gm, "")
    // Table rows (lines surrounded by |)
    .replace(/^\|.*\|$/gm, "")
    // Table separator lines
    .replace(/^[\s|:-]+$/gm, "")
    // Horizontal rules
    .replace(/^[-*_]{3,}\s*$/gm, "")
    // Bullet lists
    .replace(/^\s*[-*+]\s+/gm, "• ")
    // Numbered lists
    .replace(/^\s*\d+\.\s+/gm, "")
    // Trailing whitespace per line
    .replace(/[ \t]+$/gm, "")
    // Collapse 3+ blank lines to 2
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  // Drop lines that are too short to be meaningful (likely badge/link remnants)
  return cleaned
    .split("\n")
    .filter((line) => line.trim().length === 0 || line.trim().length > 5)
    .join("\n")
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
