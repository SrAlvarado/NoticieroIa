# 02 — Decisiones de arquitectura

Log cronológico de decisiones importantes (ADRs ligeros). Cada entrada: **Contexto → Decisión → Trade-off**.

---

## ADR-001 — Cron cada 2 h vía GitHub Actions, no Vercel Cron
**Fecha:** 2026-04-30

**Contexto:** El usuario quiere que el sistema se actualice cada 2 horas y se mantenga en plan free.

**Decisión:** Usar GitHub Actions con `cron: '0 */2 * * *'` que hace `POST` a una ruta protegida `/api/cron/refresh` en Vercel, autenticada por `CRON_SECRET`.

**Trade-off:**
- ✅ 100% gratis, fiable, desacopla scheduling del hosting, fácil de mover si cambia Vercel.
- ❌ Vercel Hobby Cron solo permite 1 ejecución/día → no cubre el requisito.
- ❌ Render free tiene crons nativos pero sufre cold starts molestos.
- ❌ Pasar a Vercel Pro implica coste mensual.

---

## ADR-002 — Supabase Postgres como BD persistente
**Fecha:** 2026-04-30

**Contexto:** El cron debe persistir noticias entre ejecuciones y entre deploys.

**Decisión:** Supabase Postgres (free tier 500 MB).

**Trade-off:**
- ✅ Persistente, REST + JS SDK, ampliable a auth/realtime.
- ❌ SQLite descartado: filesystem de Vercel es efímero.
- ❌ Turso es alternativa válida (libSQL); se eligió Supabase por ecosistema más maduro.

---

## ADR-003 — Gemini para clasificación, no Claude
**Fecha:** 2026-04-30

**Contexto:** Hay que clasificar cada noticia en una de las 5 categorías (Herramientas, Noticias, Cambios, Nuevo, Última hora). Reglas por keywords son frágiles.

**Decisión:** Usar Google Gemini API. El usuario tiene key de Gemini, no de Anthropic.

**Trade-off:**
- ✅ El usuario ya dispone de key, sin coste extra.
- ⚠️ Si en el futuro se quiere migrar a Claude, basta con cambiar el cliente; el prompt es portable.

---

## ADR-004 — Animación detalle: `layoutId` de Framer Motion
**Fecha:** 2026-04-30

**Contexto:** El usuario pide que la tarjeta se expanda a pantalla completa con animación fluida tipo "hero".

**Decisión:** Framer Motion con `layoutId` compartido entre la card del grid y el modal expandido. URL sincronizada con `[slug]` o query param para deep-link.

**Trade-off:**
- ✅ Transición nativa, performante, declarativa.
- ❌ Requiere mantener el mismo `layoutId` y estructura compatible entre origen y destino.

---

## ADR-005 — Modal global con Context, no rutas paralelas
**Fecha:** 2026-04-30

**Contexto:** La animación tarjeta → modal necesita compartir el `layoutId` entre origen (grid) y destino (modal). Opciones: rutas paralelas + intercepting (`@modal/(...)news/[id]`) o un Context client-side.

**Decisión:** `NewsModalProvider` con `useState` + `AnimatePresence`. Se monta en `app/layout.tsx`, todas las cards lo consumen vía `useNewsModal()`.

**Trade-off:**
- ✅ Simple, sin acoplamiento a la jerarquía de rutas, animación fluida garantizada.
- ❌ No hay deep-link al detalle (de momento). Si se necesita, añadir `?article=slug` con `router.replace` sin romper la animación.

---

## ADR-006 — Icono `GitBranch` en vez de `Github`
**Fecha:** 2026-04-30

**Contexto:** `lucide-react@1.x` retiró iconos de marca (incluido `Github`).

**Decisión:** Usar `GitBranch` para fuentes tipo `github`. Si más adelante se requiere el logo oficial, embeber un SVG propio.

**Trade-off:**
- ✅ Cero dependencias extra, alineado con la política de Lucide.
- ❌ El icono no representa la marca exactamente.
