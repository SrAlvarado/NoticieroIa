import { GoogleGenerativeAI } from "@google/generative-ai";
import type { CategorySlug } from "./types";

const CATEGORIES_LIST = "claude | desarrollo | herramientas | noticias | cambios";

const SYSTEM_PROMPT = `Eres un clasificador de noticias de IA. Clasifica el titular y resumen en UNA de estas categorías y responde SOLO con esa palabra:

- claude      → Claude, Anthropic, MCPs, skills, hooks, agentes de Claude, Claude Code, Claude API
- desarrollo  → SDKs, frameworks, repositorios GitHub, código, programación con IA, APIs de IA, herramientas para desarrolladores
- herramientas → apps de IA, productos de consumo, servicios, startups de IA
- noticias    → actualidad general del sector IA, investigación, análisis, empresas
- cambios     → changelogs, actualizaciones, releases, deprecaciones, versiones nuevas de modelos

Responde exclusivamente con una de estas palabras: ${CATEGORIES_LIST}`;

const KEYWORD_RULES: Array<{ keywords: RegExp[]; category: CategorySlug }> = [
  {
    keywords: [/claude/i, /anthropic/i, /\bmcp\b/i, /model.context.protocol/i, /claude.code/i, /\bskill\b/i, /\bhook\b/i],
    category: "claude",
  },
  {
    keywords: [/changelog/i, /release.note/i, /deprecat/i, /v\d+\.\d+/i, /model.update/i, /gpt-\d/i, /gemini \d/i],
    category: "cambios",
  },
  {
    keywords: [/github/i, /repositor/i, /\bsdk\b/i, /\bapi\b/i, /open.source/i, /developer/i, /programm/i, /langchain/i, /framework/i],
    category: "desarrollo",
  },
];

function heuristicClassify(title: string, summary: string): CategorySlug {
  const text = title + " " + summary;
  for (const rule of KEYWORD_RULES) {
    if (rule.keywords.some((k) => k.test(text))) return rule.category;
  }
  return "noticias";
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

const VALID: Set<string> = new Set(["claude", "desarrollo", "herramientas", "noticias", "cambios"]);

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
      contents: [{ role: "user", parts: [{ text: `Título: ${title}\nResumen: ${summary}` }] }],
    });
    const raw = result.response.text().trim().toLowerCase().split(/\s/)[0];
    if (VALID.has(raw)) return raw as CategorySlug;
  } catch {
    // fall through to heuristic
  }
  return defaultCategory ?? heuristicClassify(title, summary);
}

export async function classifyBatch(
  items: Array<{ title: string; summary: string; defaultCategory?: CategorySlug }>,
): Promise<CategorySlug[]> {
  return Promise.all(items.map((i) => classifyArticle(i.title, i.summary, i.defaultCategory)));
}
