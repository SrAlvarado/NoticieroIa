# NoticieroIA

Agregador personal de noticias de IA. Recopila y organiza información sobre nuevas
herramientas, changelogs, skills de Claude, MCPs y tendencias del ecosistema cada 2 horas.

## Stack

- **Frontend:** Next.js 15 (App Router, TS) · Tailwind CSS v4 · Framer Motion · Lucide
- **Datos:** Supabase Postgres (free tier)
- **Scrapers:** RSS · Reddit JSON · GitHub Search API · Nitter/Mastodon (best-effort)
- **LLM:** Google Gemini para clasificación
- **Cron 2 h:** GitHub Actions → POST a `/api/cron/refresh` en Vercel
- **Hosting:** Vercel (Hobby)

> Documentación viva en la bóveda Obsidian [`NoticiasIA/`](./NoticiasIA/).

## Desarrollo local

```bash
cp .env.example .env.local   # rellena las variables
npm install
npm run dev
```

## Variables de entorno

Ver [`.env.example`](./.env.example) y [`NoticiasIA/04 - Despliegue y cron.md`](./NoticiasIA/04%20-%20Despliegue%20y%20cron.md).

## Despliegue

1. Crear proyecto Supabase, ejecutar la migración en `supabase/migrations/`.
2. Conectar el repo a Vercel y configurar las variables de entorno.
3. Configurar `REFRESH_URL` y `CRON_SECRET` como secrets en GitHub.
4. El workflow `.github/workflows/refresh.yml` dispara el cron cada 2 horas.

## Estructura

```
app/                    # Next.js App Router
components/             # Componentes React
lib/                    # Clientes Supabase, Gemini, scrapers
supabase/migrations/    # SQL para crear tablas
.github/workflows/      # GitHub Actions (cron)
NoticiasIA/             # Bóveda Obsidian (decisiones, fuentes, ADRs)
```
