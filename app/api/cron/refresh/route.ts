import { NextRequest, NextResponse } from "next/server";
import { scrapeAllRss } from "@/lib/scrapers/rss";
import { scrapeReddit } from "@/lib/scrapers/reddit";
import { scrapeGitHub } from "@/lib/scrapers/github";
import { scrapeTwitter } from "@/lib/scrapers/twitter";
import { classifyBatch } from "@/lib/classifier";
import { preFilterArticles } from "@/lib/filter";
import { translateArticles } from "@/lib/translator";
import { pickFallbackImage } from "@/lib/image-pool";
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

  const sb = getSupabaseServer();

  // ?reset=1 wipes the table before inserting fresh translated articles
  const reset = req.nextUrl.searchParams.get("reset") === "1";
  if (reset) {
    await sb.from("articles").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  }

  const [rss, reddit, github, twitter] = await Promise.allSettled([
    scrapeAllRss(),
    scrapeReddit(),
    scrapeGitHub(process.env.GITHUB_TOKEN),
    scrapeTwitter(process.env.TWITTER_COOKIES),
  ]);

  const raw: ArticleInput[] = dedupeByUrl([
    ...(rss.status === "fulfilled" ? rss.value : []),
    ...(reddit.status === "fulfilled" ? reddit.value : []),
    ...(github.status === "fulfilled" ? github.value : []),
    ...(twitter.status === "fulfilled" ? twitter.value : []),
  ]);

  if (raw.length === 0) {
    return NextResponse.json({ inserted: 0, skipped: 0, errors: [] });
  }

  const filtered = preFilterArticles(raw);

  if (filtered.length === 0) {
    return NextResponse.json({ inserted: 0, skipped: raw.length, errors: [] });
  }

  const categories = await classifyBatch(
    filtered.map((a) => ({
      title: a.title,
      summary: a.summary,
      defaultCategory: a.category,
    })),
  );

  const classified = filtered.map((a, i) => ({ ...a, category: categories[i] }));

  const translations = await translateArticles(
    classified.map((a) => ({ title: a.title, summary: a.summary })),
  );
  const translated = classified.map((a, i) => ({
    ...a,
    title: translations[i].title,
    summary: translations[i].summary,
    imageUrl: a.imageUrl ?? pickFallbackImage(categories[i], a.sourceUrl),
  }));

  const { data: existing } = await sb
    .from("articles")
    .select("source_url")
    .in("source_url", translated.map((a) => a.sourceUrl));

  const existingUrls = new Set((existing ?? []).map((r: { source_url: string }) => r.source_url));

  const toInsert = translated
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
