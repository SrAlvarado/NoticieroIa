# 05 — Esquema de datos (Supabase / Postgres)

> Borrador. Se actualizará cuando se ejecute la migración real.

## Tabla `articles`

| Columna | Tipo | Notas |
|---|---|---|
| `id` | `uuid` PK | `default gen_random_uuid()` |
| `title` | `text` | Titular |
| `summary` | `text` | Breve resumen para el grid |
| `content` | `text` | Cuerpo extraído (puede ser null) |
| `image_url` | `text` | OG image o null |
| `source` | `text` | `rss` / `reddit` / `github` / `twitter` |
| `source_name` | `text` | "Anthropic", "r/LocalLLaMA", "vercel/ai-sdk", … |
| `source_url` | `text` UNIQUE | URL canónica — clave de dedupe |
| `category` | `text` | `tools` / `news` / `changes` / `new` (la categoría "Última hora" se calcula en runtime por `published_at`) |
| `published_at` | `timestamptz` | Fecha original de publicación |
| `created_at` | `timestamptz` | `default now()` — cuándo lo capturamos |

### Índices
- `UNIQUE (source_url)` — dedupe.
- `INDEX (category, published_at DESC)` — queries por sección.
- `INDEX (published_at DESC)` — feed global y "Última hora".

## Categorías (UI)
- **Última hora** — `published_at >= now() - interval '4 hours'`, ordenado DESC, mostrado en el hero.
- **Herramientas** (`tools`) — repos GitHub trending, lanzamientos de productos.
- **Noticias** (`news`) — actualidad general del sector.
- **Cambios** (`changes`) — changelogs, releases, model updates.
- **Nuevo** (`new`) — tendencias emergentes (MCPs, frameworks, paradigmas).
