# 04 — Despliegue y cron

## Hosting
- **Vercel (plan Hobby/free)** para Next.js + API Routes.
- Conexión Vercel ↔ GitHub para deploy automático en cada push a `main`.

## Variables de entorno necesarias
| Nombre | Dónde | Para qué |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Vercel + local | Cliente Supabase (público) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Vercel + local | Cliente Supabase lectura |
| `SUPABASE_SERVICE_ROLE_KEY` | Vercel + local (NO público) | Escritura desde el cron |
| `GEMINI_API_KEY` | Vercel + local | Clasificación de noticias |
| `GITHUB_TOKEN` | Vercel + local | Subir rate limit a 5000 req/h (opcional pero recomendado) |
| `CRON_SECRET` | Vercel + GitHub Actions | Proteger `/api/cron/refresh` |

## Cron de 2 h — GitHub Actions

`.github/workflows/refresh.yml`:

```yaml
name: Refresh news
on:
  schedule:
    - cron: '0 */2 * * *'   # cada 2 h en UTC
  workflow_dispatch:         # permite disparo manual

jobs:
  refresh:
    runs-on: ubuntu-latest
    steps:
      - name: Hit Vercel cron endpoint
        run: |
          curl -fsSL -X POST "$REFRESH_URL" \
            -H "Authorization: Bearer $CRON_SECRET" \
            --max-time 60
        env:
          REFRESH_URL: ${{ secrets.REFRESH_URL }}
          CRON_SECRET: ${{ secrets.CRON_SECRET }}
```

Secrets a configurar en GitHub:
- `REFRESH_URL` = `https://<deploy>.vercel.app/api/cron/refresh`
- `CRON_SECRET` = mismo valor que en Vercel.

## Endpoint protegido

`app/api/cron/refresh/route.ts`:
- Valida `Authorization: Bearer <CRON_SECRET>`.
- Lanza los scrapers en paralelo.
- Inserta `articles` nuevos en Supabase (upsert por `source_url`).
- Devuelve `{ inserted, updated, skipped, errors }`.

## Notas operativas
- Tiempo máximo de ejecución serverless de Vercel Hobby: 10 s en serverless, 60 s en Edge. Si los scrapers se acercan al límite, partir el cron en varios endpoints (`/refresh-rss`, `/refresh-reddit`, `/refresh-github`) y dispararlos en paralelo desde el workflow.
- Logs: Vercel + GitHub Actions logs. Sin observabilidad extra de momento.
