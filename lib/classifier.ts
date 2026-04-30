import { GoogleGenerativeAI } from "@google/generative-ai";
import type { CategorySlug } from "./types";

const CATEGORIES_LIST = "tools | news | changes | new";

const SYSTEM_PROMPT = `Eres un clasificador de noticias de IA. Clasifica el titular y resumen en UNA de estas categorías y responde SOLO con esa palabra:

- tools      → nuevas herramientas, apps, SDKs, repositorios, productos de IA
- news       → actualidad general del sector IA, investigaciones, análisis
- changes    → changelogs, actualizaciones, deprecaciones, releases de modelos existentes
- new        → tendencias emergentes, nuevos paradigmas, MCPs, frameworks, metodologías

Responde exclusivamente con una de estas palabras: ${CATEGORIES_LIST}`;

const KEYWORD_RULES: Array<{ keywords: string[]; category: CategorySlug }> = [
  {
    keywords: ["changelog", "update", "release", "v\\d+\\.", "deprecat", "migration"],
    category: "changes",
  },
  {
    keywords: ["github", "repositor", "sdk", "library", "framework", "tool", "launch", "launch"],
    category: "tools",
  },
  {
    keywords: ["mcp", "model context protocol", "skill", "hook", "harness", "agent framework"],
    category: "new",
  },
];

function heuristicClassify(title: string, summary: string): CategorySlug {
  const text = (title + " " + summary).toLowerCase();
  for (const rule of KEYWORD_RULES) {
    if (rule.keywords.some((k) => new RegExp(k, "i").test(text))) {
      return rule.category;
    }
  }
  return "news";
}

let _genAI: GoogleGenerativeAI | null = null;
function getAI() {
  if (!_genAI) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) throw new Error("GEMINI_API_KEY not set");
    _genAI = new GoogleGenerativeAI(key);
  }
  return _genAI;
}

const VALID: Set<string> = new Set(["tools", "news", "changes", "new"]);

export async function classifyArticle(
  title: string,
  summary: string,
  defaultCategory?: CategorySlug,
): Promise<CategorySlug> {
  if (!process.env.GEMINI_API_KEY) {
    return defaultCategory ?? heuristicClassify(title, summary);
  }
  try {
    const model = getAI().getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent({
      systemInstruction: SYSTEM_PROMPT,
      contents: [
        {
          role: "user",
          parts: [{ text: `Título: ${title}\nResumen: ${summary}` }],
        },
      ],
    });
    const raw = result.response.text().trim().toLowerCase().split(/\s/)[0];
    if (VALID.has(raw)) return raw as CategorySlug;
  } catch {
    // fall through
  }
  return defaultCategory ?? heuristicClassify(title, summary);
}

export async function classifyBatch(
  items: Array<{ title: string; summary: string; defaultCategory?: CategorySlug }>,
): Promise<CategorySlug[]> {
  return Promise.all(
    items.map((i) => classifyArticle(i.title, i.summary, i.defaultCategory)),
  );
}
