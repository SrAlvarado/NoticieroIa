# 99 — Pendientes y riesgos

## Pendientes inmediatos (Fase 1)
- [ ] `npx create-next-app` en la raíz del proyecto.
- [ ] Instalar Framer Motion, Lucide, rss-parser, Supabase JS, Gemini SDK, article-extractor.
- [ ] Configurar Tailwind v4 + tema dark premium.
- [ ] Crear `.env.example` con todas las variables.

## Pendientes Fase 2 (UI)
- [ ] Layout principal con header y nav de categorías.
- [ ] Componente `NewsCard` con hover y `layoutId`.
- [ ] Modal/route de detalle con animación hero a fullscreen.
- [ ] Sección "Última hora" destacada arriba.

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
