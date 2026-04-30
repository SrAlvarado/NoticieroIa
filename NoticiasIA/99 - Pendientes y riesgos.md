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

## Pendientes Fase 3 (Scrapers) ✅
- [x] Servicio RSS multi-feed con dedupe (`lib/scrapers/rss.ts`, 7 feeds configurados).
- [x] Servicio Reddit con User-Agent (`lib/scrapers/reddit.ts`, 6 subreddits).
- [x] Servicio GitHub trending (`lib/scrapers/github.ts`, 6 topics, 7 días).
- [x] Cliente Gemini para clasificación (`lib/classifier.ts`, fallback heurístico).
- [x] Endpoint `/api/cron/refresh` con auth por `CRON_SECRET`.
- [x] Migración SQL en `supabase/migrations/0001_init.sql`.
- [x] `lib/articles.ts` usa Supabase si hay env vars, mock si no.

> Nota Fase 3: Supabase TS client requiere tipos generados para el type checker. Se usa `SupabaseClient<any>` hasta que se ejecute `supabase gen types typescript`. Ver ADR-007.

## Pendientes Fase 4 (Deploy)
- [ ] Workflow `refresh.yml` en `.github/workflows/`.
- [ ] Documentar en README cómo conectar a Vercel + Supabase.
- [ ] Instrucciones finales de deploy.

## Riesgos conocidos
- **X/Twitter scraping**: Nitter/Mastodon no son fiables. Asumir best-effort y no romper el cron si fallan.
- **Vercel Hobby timeout**: si el cron tarda > 10 s, partir endpoints. Solución preparada en ADR / Despliegue.
- **Reddit 429**: respetar `User-Agent` único y limitar concurrencia.
- **Gemini rate limits**: cachear clasificación por `source_url`, no reclasificar artículos ya guardados.
- **Imágenes rotas**: fallback a placeholder generado o gradient si el OG image falla.
