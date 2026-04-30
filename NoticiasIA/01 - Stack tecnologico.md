# 01 — Stack tecnológico

> Confirmado el **2026-04-30** con el usuario.

## Frontend
- **Next.js 15** — App Router, TypeScript, React Server Components.
- **Tailwind CSS v4** — utilidades, theming dark premium.
- **Framer Motion** — animaciones, en especial `layoutId` para la transición tarjeta → fullscreen.
- **Lucide Icons** — iconografía minimalista.

Inspiración visual: [540deg.com](https://540deg.com) — moderno, minimalista, dinámico.

## Backend / Datos
- **Supabase (Postgres free tier)** — base de datos persistente.
  - Descartado SQLite porque el filesystem de Vercel es efímero.
  - Alternativa equivalente: Turso (libSQL).
- **Next.js API Routes** para `/api/cron/refresh` y endpoints de lectura.

## LLM
- **Google Gemini API** (`@google/generative-ai`) — clasificación automática de cada noticia en una de las 5 categorías.
- *No se usa Claude API* — el usuario no dispone de key Anthropic en este proyecto.

## Scraping / Fuentes
- **`rss-parser`** — feeds RSS de blogs y medios.
- **Reddit JSON público** — sin API key (`reddit.com/r/{sub}/new.json`).
- **GitHub REST API** — `search/repositories` con token público (5000 req/h).
- **Nitter / Mastodon RSS** — fallback para X/Twitter (best-effort, los oficiales no son fiables).
- **`@extractus/article-extractor`** — extracción de contenido + Open Graph image.

## Hosting & Cron
- **Vercel (Hobby / free)** para el frontend y las API routes.
- **GitHub Actions** como scheduler del cron de 2 h (Vercel Hobby solo permite 1 ejecución/día).

## Lenguaje y herramientas
- TypeScript en todo el repo.
- ESLint + Prettier (default Next.js).
- Variables de entorno en `.env.local` (no commiteado), documentadas en `.env.example`.
