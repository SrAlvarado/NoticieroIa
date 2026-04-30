import { GoogleGenerativeAI } from "@google/generative-ai";

let _genAI: GoogleGenerativeAI | null = null;
function getAI() {
  if (!_genAI) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) throw new Error("GEMINI_API_KEY not set");
    _genAI = new GoogleGenerativeAI(key);
  }
  return _genAI;
}

const SYSTEM_PROMPT = `Eres un traductor especializado en tecnología e inteligencia artificial.
Traduce al español los campos title y summary de cada artículo en el array JSON que te proporcionan.
Devuelve ÚNICAMENTE un array JSON válido con los mismos objetos pero con title y summary traducidos.
Conserva términos técnicos en inglés cuando sea lo habitual (API, SDK, LLM, prompt, token, etc.).
No añadas explicaciones ni texto fuera del JSON.`;

type TranslationInput = { title: string; summary: string };
type TranslationOutput = { title: string; summary: string };

const BATCH_SIZE = 20;

async function translateBatchWithGemini(
  items: TranslationInput[],
): Promise<TranslationOutput[]> {
  const model = getAI().getGenerativeModel({ model: "gemini-2.0-flash" });
  const result = await model.generateContent({
    systemInstruction: SYSTEM_PROMPT,
    contents: [
      {
        role: "user",
        parts: [{ text: JSON.stringify(items) }],
      },
    ],
  });

  const raw = result.response.text().trim();
  const jsonMatch = raw.match(/\[[\s\S]*\]/);
  if (!jsonMatch) throw new Error("No JSON array in response");
  const parsed: TranslationOutput[] = JSON.parse(jsonMatch[0]);
  if (!Array.isArray(parsed) || parsed.length !== items.length) {
    throw new Error("Response length mismatch");
  }
  return parsed;
}

const CONTENT_PROMPT = `Eres un traductor especializado en tecnología e inteligencia artificial.
Traduce al español el texto que te proporcionen.
Conserva los saltos de línea originales.
Conserva términos técnicos en inglés cuando sea lo habitual (API, SDK, LLM, prompt, token, etc.).
Devuelve ÚNICAMENTE el texto traducido, sin prefijos ni explicaciones.`;

// Translate a single block of text (article body or README excerpt).
// Caps at 5000 chars to keep latency reasonable; returns original on failure.
export async function translateContent(text: string): Promise<string> {
  if (!process.env.GEMINI_API_KEY) return text;
  const excerpt = text.slice(0, 5000);
  try {
    const model = getAI().getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent({
      systemInstruction: CONTENT_PROMPT,
      contents: [{ role: "user", parts: [{ text: excerpt }] }],
    });
    return result.response.text().trim();
  } catch (err) {
    console.error("[translateContent] Gemini error:", err);
    return excerpt;
  }
}

export async function translateArticles(
  items: TranslationInput[],
): Promise<TranslationOutput[]> {
  if (!process.env.GEMINI_API_KEY) return items;

  const results: TranslationOutput[] = [];

  for (let i = 0; i < items.length; i += BATCH_SIZE) {
    const batch = items.slice(i, i + BATCH_SIZE);
    try {
      const translated = await translateBatchWithGemini(batch);
      results.push(...translated);
    } catch {
      // fallback: keep originals for this batch
      results.push(...batch);
    }
  }

  return results;
}
