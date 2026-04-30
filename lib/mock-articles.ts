import type { Article } from "./types";

const minutesAgo = (m: number) => new Date(Date.now() - m * 60_000).toISOString();
const hoursAgo = (h: number) => new Date(Date.now() - h * 60 * 60_000).toISOString();
const daysAgo = (d: number) => new Date(Date.now() - d * 24 * 60 * 60_000).toISOString();

export const MOCK_ARTICLES: Article[] = [
  {
    id: "anthropic-claude-opus-4-7",
    title: "Anthropic lanza Claude Opus 4.7 con context windowing nativo",
    summary:
      "El modelo insignia de Anthropic estrena gestión automática de contexto y mejoras notables en planificación a largo plazo en agentes.",
    content:
      "Anthropic ha presentado Claude Opus 4.7, la nueva versión de su modelo más capaz. Entre las novedades destacan un sistema nativo de context windowing, mejoras en agentic planning y un caché de prompt más agresivo. La compañía afirma que la latencia se reduce un 18% en cargas largas.",
    imageUrl:
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&q=80&auto=format&fit=crop",
    source: "rss",
    sourceName: "Anthropic News",
    sourceUrl: "https://www.anthropic.com/news/claude-opus-4-7",
    category: "changes",
    publishedAt: minutesAgo(45),
  },
  {
    id: "vercel-ai-sdk-5-stable",
    title: "Vercel AI SDK 5 sale estable con tool streaming bidireccional",
    summary:
      "La versión 5 unifica chat, completions y tools, añade streaming de herramientas y soporte oficial para Gemini 2.5 y Claude 4.7.",
    imageUrl:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80&auto=format&fit=crop",
    source: "github",
    sourceName: "vercel/ai",
    sourceUrl: "https://github.com/vercel/ai/releases/tag/v5.0.0",
    category: "tools",
    publishedAt: hoursAgo(1),
  },
  {
    id: "mcp-2-1-spec",
    title: "El Model Context Protocol 2.1 estandariza skills y resources",
    summary:
      "La nueva spec del MCP introduce primitives para skills, recursos remotos firmados y un sistema de capacidades negociado.",
    imageUrl:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&q=80&auto=format&fit=crop",
    source: "github",
    sourceName: "modelcontextprotocol/spec",
    sourceUrl: "https://github.com/modelcontextprotocol/specification",
    category: "new",
    publishedAt: hoursAgo(2),
  },
  {
    id: "openai-codex-headless",
    title: "OpenAI lanza Codex Headless para CI/CD con coste por minuto",
    summary:
      "Codex se mueve fuera del IDE: ahora puede ejecutarse en pipelines, con sandbox, control de coste y reportes de cobertura de tests.",
    imageUrl:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80&auto=format&fit=crop",
    source: "rss",
    sourceName: "OpenAI Blog",
    sourceUrl: "https://openai.com/blog/codex-headless",
    category: "tools",
    publishedAt: hoursAgo(3),
  },
  {
    id: "gemini-3-pro-rumor",
    title: "Filtraciones apuntan a un Gemini 3 Pro con razonamiento agentic",
    summary:
      "Internas de Google sugieren que la próxima versión de Gemini incluirá un loop de razonamiento dedicado para tareas multi-paso.",
    imageUrl:
      "https://images.unsplash.com/photo-1677442135722-5f5e58f3b8c8?w=1200&q=80&auto=format&fit=crop",
    source: "reddit",
    sourceName: "r/singularity",
    sourceUrl: "https://reddit.com/r/singularity/comments/abc",
    category: "news",
    publishedAt: hoursAgo(5),
  },
  {
    id: "claude-skills-marketplace",
    title: "Anthropic abre el marketplace de skills para Claude Code",
    summary:
      "Los desarrolladores ya pueden publicar y monetizar skills empaquetadas. Soporte de plantillas, hooks y subagentes incluido.",
    imageUrl:
      "https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&q=80&auto=format&fit=crop",
    source: "rss",
    sourceName: "Anthropic News",
    sourceUrl: "https://www.anthropic.com/news/claude-skills-marketplace",
    category: "new",
    publishedAt: hoursAgo(6),
  },
  {
    id: "langchain-runtime-rewrite",
    title: "LangChain reescribe su runtime sobre OpenTelemetry",
    summary:
      "La 0.4 deja atrás callbacks heredados y se apoya en spans de OTel, simplificando la observabilidad y reduciendo overhead.",
    imageUrl:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80&auto=format&fit=crop",
    source: "github",
    sourceName: "langchain-ai/langchain",
    sourceUrl: "https://github.com/langchain-ai/langchain",
    category: "changes",
    publishedAt: hoursAgo(8),
  },
  {
    id: "perplexity-comet-multimodal",
    title: "Perplexity Comet añade búsqueda multimodal por captura",
    summary:
      "El navegador con IA puede buscar a partir de cualquier región de la pantalla y compone respuestas con múltiples fuentes.",
    imageUrl:
      "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=1200&q=80&auto=format&fit=crop",
    source: "rss",
    sourceName: "TechCrunch AI",
    sourceUrl: "https://techcrunch.com/perplexity-comet-multimodal",
    category: "tools",
    publishedAt: hoursAgo(11),
  },
  {
    id: "open-llama-4-tiny",
    title: "Open-LLaMA 4 Tiny iguala a GPT-4o-mini con 7B parámetros",
    summary:
      "El modelo abierto de 7B logra resultados sorprendentes en MMLU y HumanEval gracias a un proceso de destilación con Claude Opus.",
    imageUrl:
      "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1200&q=80&auto=format&fit=crop",
    source: "reddit",
    sourceName: "r/LocalLLaMA",
    sourceUrl: "https://reddit.com/r/LocalLLaMA/comments/llama4tiny",
    category: "news",
    publishedAt: hoursAgo(14),
  },
  {
    id: "shadcn-blocks-ai",
    title: "shadcn/ui publica bloques especializados para apps con IA",
    summary:
      "Plantillas listas para chat, agent traces y dashboards de uso de tokens, todas con dark mode y theming nativo.",
    imageUrl:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&q=80&auto=format&fit=crop",
    source: "github",
    sourceName: "shadcn-ui/ui",
    sourceUrl: "https://github.com/shadcn-ui/ui",
    category: "tools",
    publishedAt: hoursAgo(20),
  },
  {
    id: "gpt-store-deprecation",
    title: "OpenAI deprecará el GPT Store clásico el próximo trimestre",
    summary:
      "Los GPTs migrarán al nuevo formato Apps con OAuth, billing nativo y soporte para tools de terceros vía MCP.",
    imageUrl:
      "https://images.unsplash.com/photo-1634133855292-a3d4f5b54bbd?w=1200&q=80&auto=format&fit=crop",
    source: "rss",
    sourceName: "OpenAI Blog",
    sourceUrl: "https://openai.com/blog/gpt-store-apps-migration",
    category: "changes",
    publishedAt: daysAgo(1),
  },
  {
    id: "gemini-cli-skills",
    title: "Gemini CLI añade skills compartidas con el ecosistema MCP",
    summary:
      "Google trae paridad con Claude Code: skills empaquetadas, hooks de pre/post tool y settings.json estandarizado.",
    imageUrl:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&q=80&auto=format&fit=crop",
    source: "rss",
    sourceName: "Google AI Blog",
    sourceUrl: "https://blog.google/technology/ai/gemini-cli-skills",
    category: "new",
    publishedAt: daysAgo(2),
  },
];
