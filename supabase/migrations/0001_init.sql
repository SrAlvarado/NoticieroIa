create extension if not exists "pgcrypto";

create table if not exists articles (
  id           uuid        primary key default gen_random_uuid(),
  title        text        not null,
  summary      text        not null default '',
  content      text,
  image_url    text,
  source       text        not null,  -- rss | reddit | github | twitter | mastodon
  source_name  text        not null,
  source_url   text        not null unique,
  category     text        not null,  -- tools | news | changes | new
  published_at timestamptz not null default now(),
  created_at   timestamptz not null default now()
);

create index if not exists articles_category_published
  on articles (category, published_at desc);

create index if not exists articles_published
  on articles (published_at desc);

comment on table articles is
  'Noticias de IA recopiladas automáticamente por el cron de 2 horas.';
comment on column articles.source_url is
  'URL canónica — clave de deduplicación. UNIQUE enforced at DB level.';
comment on column articles.category is
  'Clasificado por Gemini o heurísticas. Valores: tools | news | changes | new.';
