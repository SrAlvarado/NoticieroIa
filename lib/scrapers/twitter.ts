import { Scraper, SearchMode } from 'agent-twitter-client';
import type { Article } from "../types";

export async function scrapeTwitter(cookiesString?: string): Promise<Omit<Article, "id">[]> {
  if (!cookiesString) {
    console.log("[Twitter] No TWITTER_COOKIES configured. Skipping.");
    return [];
  }
  
  const scraper = new Scraper();
  
  try {
    const cookies = JSON.parse(cookiesString);
    await scraper.setCookies(cookies);
  } catch (err) {
    console.error("[Twitter] Formato de cookies inválido. Debe ser un JSON array.");
    return [];
  }
  
  // Queries extraídas del documento de Gemini para máxima relevancia
  const queries = [
    '#ClaudeCode OR "Model Context Protocol"',
    '"gemini 2.0 flash" OR #mcp'
  ];
  const maxTweetsPerQuery = 10;
  const results: Omit<Article, "id">[] = [];

  for (const query of queries) {
    try {
      const tweetStream = scraper.searchTweets(query, maxTweetsPerQuery, SearchMode.Latest);
      
      for await (const tweet of tweetStream) {
        if (!tweet.text || tweet.isRetweet) continue;
        
        let imageUrl = null;
        if (tweet.photos && tweet.photos.length > 0) {
          imageUrl = tweet.photos[0].url;
        }
        
        results.push({
          title: `Tweet de @${tweet.username || 'usuario'}`,
          summary: tweet.text.length > 280 ? tweet.text.slice(0, 280) + '...' : tweet.text,
          content: tweet.text,
          imageUrl,
          source: "twitter",
          sourceName: `@${tweet.username || 'usuario'} en X`,
          sourceUrl: tweet.id ? `https://x.com/${tweet.username || 'i'}/status/${tweet.id}` : '',
          category: "noticias",
          publishedAt: new Date(tweet.timeParsed || Date.now()).toISOString(),
        });
        
        if (results.length >= maxTweetsPerQuery) break;
      }
    } catch (err) {
      console.error(`[Twitter] Error scraping query '${query}':`, err);
    }
  }
  
  return results.filter(a => a.sourceUrl);
}
