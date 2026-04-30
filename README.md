# NoticieroIA

Agregador personal de noticias de IA. Recopila y organiza información sobre nuevas
herramientas, changelogs, skills de Claude, MCPs y tendencias del ecosistema cada 2 horas.

## Stack

| Capa | Tecnología |
|---|---|
| Frontend | Next.js 16 (App Router, TS) · Tailwind CSS v4 · Framer Motion |
| Base de datos | Supabase Postgres (free tier) |
| Scrapers | RSS (7 feeds) · Reddit JSON · GitHub Search API |
| LLM | Google Gemini 2.0 Flash — clasificación de categorías |
| Cron 2 h | GitHub Actions → POST `/api/cron/refresh` en Vercel |
| Hosting | Vercel Hobby (free) |

> Documentación técnica y ADRs en la bóveda Obsidian [`NoticiasIA/`](./NoticiasIA/).

---

## Desarrollo local

```bash
# 1. Clonar
git clone https://github.com/SrAlvarado/NoticieroIa.git
cd NoticieroIa

# 2. Variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales

# 3. Instalar y arrancar
npm install
npm run dev          # http://localhost:3000
```

Sin variables de entorno la app funciona con **datos mock** incluidos en el repo.

---

## Despliegue en producción

### 1 · Supabase

1. Crea un proyecto en [supabase.com](https://supabase.com) (plan free).
2. Ve a **SQL Editor** y ejecuta el contenido de `supabase/migrations/0001_init.sql`.
3. Copia las URLs y keys desde **Project Settings → API**.

### 2 · Vercel

1. En [vercel.com](https://vercel.com), importa el repo `SrAlvarado/NoticieroIa`.
2. Añade las variables de entorno (Settings → Environment Variables):

| Variable | Dónde encontrarla |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API → anon public |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API → service_role secret |
| `GEMINI_API_KEY` | [Google AI Studio](https://aistudio.google.com/apikey) |
| `GITHUB_TOKEN` | GitHub → Settings → Developer Settings → Personal Access Tokens (scope: `public_repo`) |
| `CRON_SECRET` | Genera un string aleatorio: `openssl rand -hex 32` |

3. Despliega. Anota la URL de producción (ej. `https://noticiero-ia.vercel.app`).

### 3 · GitHub Actions (cron cada 2 h)

En el repo GitHub, ve a **Settings → Secrets and variables → Actions** y crea:

| Secret | Valor |
|---|---|
| `REFRESH_URL` | `https://<tu-deploy>.vercel.app/api/cron/refresh` |
| `CRON_SECRET` | El mismo string que en Vercel |

El workflow `.github/workflows/refresh.yml` se dispara automáticamente cada 2 horas.
Para probarlo manualmente: **Actions → Refresh news every 2 hours → Run workflow**.

---

## Estructura del proyecto

```
app/
  page.tsx                     # Homepage: Última hora + secciones
  layout.tsx                   # Root layout con header, footer, modal provider
  globals.css                  # Tema dark premium (Tailwind v4 tokens)
  category/[slug]/page.tsx     # Vista por categoría
  api/cron/refresh/route.ts    # Endpoint autenticado del cron

components/
  news-card.tsx                # Card con Framer Motion layoutId
  news-modal.tsx               # Modal fullscreen con hero animation
  news-modal-provider.tsx      # Context + AnimatePresence
  latest-hero.tsx              # Sección "Última hora"
  category-section.tsx         # Sección por categoría
  site-header.tsx              # Header sticky con nav
  site-footer.tsx
  source-badge.tsx
  category-badge.tsx

lib/
  types.ts                     # Article, CategorySlug, etc.
  categories.ts                # Metadata de categorías + helpers
  articles.ts                  # getArticles (Supabase o mock)
  format.ts                    # timeAgo helper
  classifier.ts                # Gemini + heurísticas
  mock-articles.ts             # Datos de muestra para dev
  scrapers/
    rss.ts                     # 7 feeds RSS
    reddit.ts                  # 6 subreddits
    github.ts                  # GitHub Search API
  supabase/
    server.ts                  # Cliente con service_role

supabase/
  migrations/
    0001_init.sql              # Tabla articles + índices

.github/
  workflows/
    refresh.yml                # Cron cada 2 h → POST /api/cron/refresh

NoticiasIA/                    # Bóveda Obsidian (ADRs, fuentes, decisiones)
```

---

## Añadir fuentes RSS

Edita `lib/scrapers/rss.ts` → array `RSS_FEEDS`:

```ts
{
  url: "https://ejemplo.com/rss.xml",
  sourceName: "Mi fuente",
  defaultCategory: "news",   // tools | news | changes | new
}
```

La próxima ejecución del cron lo incorporará automáticamente.
