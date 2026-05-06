import type { Article } from "./types";

type ArticleInput = Omit<Article, "id">;

const DENY_RULES = [
  /\bcrypto\b/i,
  /\bcryptocurrency\b/i,
  /\bnft\b/i,
  /\bbitcoin\b/i,
  /\bethereum\b/i,
  /\bpolítica\b/i,
  /\bpolitics\b/i,
  /\bnsfw\b/i,
  /\bentretenimiento\b/i,
  /\bporn\b/i,
  /\bcasino\b/i,
];

const INCLUSION_WEIGHTS: Array<{ regex: RegExp; weight: number }> = [
  // High value targets
  { regex: /\bclaude\b/i, weight: 15 },
  { regex: /\bmcp\b/i, weight: 20 },
  { regex: /model\scontext\sprotocol/i, weight: 20 },
  { regex: /\banthropic\b/i, weight: 15 },
  { regex: /\bgemini\b/i, weight: 10 },
  { regex: /gpt-4/i, weight: 10 },
  { regex: /o1|o3-mini/i, weight: 10 },
  
  // Medium value targets
  { regex: /\bagent\b/i, weight: 8 },
  { regex: /\bagentes\b/i, weight: 8 },
  { regex: /\bllm\b/i, weight: 8 },
  { regex: /\bopenai\b/i, weight: 8 },
  { regex: /changelog/i, weight: 8 },
  { regex: /release\snote/i, weight: 8 },
  
  // Lower value contextual targets
  { regex: /\bskill\b/i, weight: 3 },
  { regex: /\bgithub\b/i, weight: 3 },
  { regex: /\bframework\b/i, weight: 4 },
  { regex: /\bapi\b/i, weight: 3 },
  { regex: /\bia\b/i, weight: 2 },
  { regex: /\bai\b/i, weight: 2 },
  { regex: /artificial\sintelligence/i, weight: 3 },
  { regex: /inteligencia\sartificial/i, weight: 3 },
];

// Minimum score required to pass the filter
const MINIMUM_SCORE_THRESHOLD = 4;

function scoreArticle(text: string): number {
  let score = 0;
  for (const rule of INCLUSION_WEIGHTS) {
    if (rule.regex.test(text)) {
      score += rule.weight;
    }
  }
  return score;
}

export function preFilterArticles(articles: ArticleInput[]): ArticleInput[] {
  return articles.filter((article) => {
    const textToAnalyze = `${article.title} ${article.summary} ${article.content || ""}`.toLowerCase();

    // 1. Deny Rules
    for (const deny of DENY_RULES) {
      if (deny.test(textToAnalyze)) {
        console.log(`[Filter] Rejected (Deny Rule) -> ${article.title}`);
        return false;
      }
    }

    // 2. Weighted Inclusion
    const score = scoreArticle(textToAnalyze);
    
    // Allow slightly lower threshold for GitHub sources as they are inherently technical
    let finalThreshold = MINIMUM_SCORE_THRESHOLD;
    if (article.source === "github") {
       finalThreshold -= 2;
    }
    
    if (score < finalThreshold) {
       console.log(`[Filter] Rejected (Low Score: ${score}) -> ${article.title}`);
       return false;
    }

    return true;
  });
}
