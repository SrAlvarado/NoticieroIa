# 03 — Fuentes de datos

Estrategia: priorizar fuentes con APIs/feeds estables y abiertas. X/Twitter es best-effort.

## RSS (vía `rss-parser`)
Lista inicial — ajustable:
- Anthropic News — `https://www.anthropic.com/news/rss.xml`
- OpenAI Blog — `https://openai.com/blog/rss.xml`
- Google AI Blog — `https://blog.google/technology/ai/rss/`
- The Verge AI — `https://www.theverge.com/ai-artificial-intelligence/rss/index.xml`
- TechCrunch AI — `https://techcrunch.com/category/artificial-intelligence/feed/`
- Hacker News (front page filtrado por keywords IA) — `https://hnrss.org/frontpage`
- arXiv cs.AI — `http://export.arxiv.org/rss/cs.AI`

## Reddit (JSON público, sin API key)
Subreddits:
- `r/LocalLLaMA`
- `r/artificial`
- `r/singularity`
- `r/ClaudeAI`
- `r/OpenAI`
- `r/MachineLearning`

Endpoint: `https://www.reddit.com/r/{sub}/new.json?limit=25`

User-Agent obligatorio para evitar 429.

## GitHub
- Endpoint: `https://api.github.com/search/repositories?q=topic:ai+created:>{date}&sort=stars&order=desc`
- Token opcional (`GITHUB_TOKEN`) sube de 60 → 5000 req/h.
- También se consulta `topic:llm`, `topic:agents`, `topic:mcp`.

## X/Twitter (best-effort)
- No hay API gratis fiable para lectura.
- Plan: Nitter mirrors RSS (`https://nitter.net/{user}/rss`), pero los mirrors caen con frecuencia.
- Fallback: cuentas espejadas en Mastodon vía RSS (`https://mastodon.social/@{user}.rss`).
- Si falla todo, se omite sin romper el cron.

## Extracción de contenido
- `@extractus/article-extractor` para readability + Open Graph image.
- Si no hay imagen, fallback a screenshot OG vía API pública o placeholder.

## Categorización
- Reglas por palabras clave + fuente como primera capa.
- Gemini como segunda capa para casos ambiguos (prompt: "clasifica en Herramientas / Noticias / Cambios / Nuevo / Última hora").
- "Última hora" se aplica automáticamente si `published_at` < 4 h.
