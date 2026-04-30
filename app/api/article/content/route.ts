import { NextRequest, NextResponse } from "next/server";
import { fetchArticleContent } from "@/lib/fetch-content";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url) {
    return NextResponse.json({ error: "url param required" }, { status: 400 });
  }
  const result = await fetchArticleContent(url, process.env.GITHUB_TOKEN);
  if (result.type === "empty") {
    return NextResponse.json({ type: "article", content: null });
  }
  return NextResponse.json(result);
}
