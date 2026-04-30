import { NextRequest, NextResponse } from "next/server";
import { extract } from "@extractus/article-extractor";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

function isGitHubRepo(url: string): boolean {
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

async function fetchGitHubReadme(repoUrl: string, token?: string): Promise<string | null> {
  try {
    const parts = new URL(repoUrl).pathname.split("/").filter(Boolean);
    const [owner, repo] = parts;
    const headers: Record<string, string> = {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "noticieroIA/1.0",
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, { headers });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.content) return null;

    const decoded = Buffer.from(data.content, "base64").toString("utf-8");
    return decoded;
  } catch {
    return null;
  }
}

function markdownToText(md: string): string {
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

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url) {
    return NextResponse.json({ error: "url param required" }, { status: 400 });
  }

  try {
    if (isGitHubRepo(url)) {
      const readme = await fetchGitHubReadme(url, process.env.GITHUB_TOKEN);
      if (readme) {
        return NextResponse.json({
          type: "readme",
          content: markdownToText(readme),
          rawMarkdown: readme,
        });
      }
      return NextResponse.json({ type: "readme", content: null });
    }

    const article = await extract(url, {
      wordsPerMinute: 300,
    });

    if (!article) {
      return NextResponse.json({ type: "article", content: null });
    }

    const textContent = (article.content ?? "")
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    return NextResponse.json({
      type: "article",
      title: article.title,
      content: textContent || null,
      image: article.image ?? null,
    });
  } catch {
    return NextResponse.json({ type: "article", content: null });
  }
}
