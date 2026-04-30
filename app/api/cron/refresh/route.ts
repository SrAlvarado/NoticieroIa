import { NextRequest, NextResponse } from "next/server";
import { scrapeAllRss } from "@/lib/scrapers/rss";
import { scrapeReddit } from "@/lib/scrapers/reddit";
import { scrapeGitHub } from "@/lib/scrapers/github";
import { classifyBatch } from "@/lib/classifier";
import { getSupabaseServer, isSupabaseConfigured } from "@/lib/supabase/server";
import type { Article } from "@/lib/types";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

type ArticleInput = Omit<Article, "id">;

function dedupeByUrl(items: ArticleInput[]): ArticleInput[] {
  const seen = new Set<string>();
  return items.filter((a) => {
    if (!a.sourceUrl || seen.has(a.sourceUrl)) return false;
    seen.add(a.sourceUrl);
    return true;
  });
}

export async function POST(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Supabase not configured. Set env vars first." },
      { status: 503 },
    );
  }

  const [rss, reddit, github] = await Promise.allSettled([
    scrapeAllRss(),
    scrapeReddit(),
    scrapeGitHub(process.env.GITHUB_TOKEN),
  ]);

  const raw: ArticleInput[] = dedupeByUrl([
    ...(rss.status === "fulfilled" ? rss.value : []),
    ...(reddit.status === "fulfilled" ? reddit.value : []),
    ...(github.status === "fulfilled" ? github.value : []),
  ]);

  if (raw.length === 0) {
    return NextResponse.json({ inserted: 0, skipped: 0, errors: [] });
  }

  const categories = await classifyBatch(
    raw.map((a) => ({
      title: a.title,
      summary: a.summary,
      defaultCategory: a.category,
    })),
  );

  const classified = raw.map((a, i) => ({ ...a, category: categories[i] }));

  const sb = getSupabaseServer();

  const { data: existing } = await sb
    .from("articles")
    .select("source_url")
    .in("source_url", classified.map((a) => a.sourceUrl));

  const existingUrls = new Set((existing ?? []).map((r: { source_url: string }) => r.source_url));

  const toInsert = classified
    .filter((a) => !existingUrls.has(a.sourceUrl))
    .map((a) => ({
      title: a.title,
      summary: a.summary,
      content: a.content ?? null,
      image_url: a.imageUrl ?? null,
      source: a.source,
      source_name: a.sourceName,
      source_url: a.sourceUrl,
      category: a.category,
      published_at: a.publishedAt,
    }));

  const errors: string[] = [];
  let inserted = 0;

  if (toInsert.length > 0) {
    const { error } = await sb.from("articles").insert(toInsert);
    if (error) {
      errors.push(error.message);
    } else {
      inserted = toInsert.length;
    }
  }

  return NextResponse.json({
    inserted,
    skipped: classified.length - inserted,
    total_scraped: raw.length,
    errors,
  });
}

export async function GET(req: NextRequest) {
  return POST(req);
}
