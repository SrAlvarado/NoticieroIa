# 99 — Pendientes y riesgos

## Pendientes inmediatos (Fase 1) ✅
- [x] `npx create-next-app` en la raíz del proyecto.
- [x] Instalar Framer Motion, Lucide, rss-parser, Supabase JS, Gemini SDK, article-extractor.
- [x] Configurar Tailwind v4 + tema dark premium.
- [x] Crear `.env.example` con todas las variables.

## Pendientes Fase 2 (UI) ✅
- [x] Layout principal con header y nav de categorías.
- [x] Componente `NewsCard` con hover y `layoutId`.
- [x] Modal/route de detalle con animación hero a fullscreen.
- [x] Sección "Última hora" destacada arriba.
- [x] Página por categoría `/category/[slug]`.

> Nota: `lucide-react@1.x` ha eliminado el icono `Github` (motivos de marca). Sustituido por `GitBranch` para fuentes tipo `github`.

## Pendientes Fase 3 (Scrapers)
- [ ] Servicio RSS multi-feed con dedupe.
- [ ] Servicio Reddit con User-Agent.
- [ ] Servicio GitHub trending.
- [ ] Cliente Gemini para clasificación.
- [ ] Endpoint `/api/cron/refresh` con auth por `CRON_SECRET`.

## Pendientes Fase 4 (Deploy)
- [ ] Workflow `refresh.yml` en `.github/workflows/`.
- [ ] Documentar en README cómo conectar a Vercel + Supabase.
- [ ] Migración SQL para crear `articles`.

## Riesgos conocidos
- **X/Twitter scraping**: Nitter/Mastodon no son fiables. Asumir best-effort y no romper el cron si fallan.
- **Vercel Hobby timeout**: si el cron tarda > 10 s, partir endpoints. Solución preparada en ADR / Despliegue.
- **Reddit 429**: respetar `User-Agent` único y limitar concurrencia.
- **Gemini rate limits**: cachear clasificación por `source_url`, no reclasificar artículos ya guardados.
- **Imágenes rotas**: fallback a placeholder generado o gradient si el OG image falla.
