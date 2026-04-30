"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, X, Loader2, BookOpen } from "lucide-react";
import { CategoryBadge } from "./category-badge";
import { SourceBadge } from "./source-badge";
import { timeAgo } from "@/lib/format";
import type { Article } from "@/lib/types";

type ContentState =
  | { status: "loading" }
  | { status: "loaded"; content: string; type: "article" | "readme" }
  | { status: "empty" }
  | { status: "error" };

function ArticleContent({ content }: { content: string }) {
  return (
    <div className="space-y-4 text-sm leading-7 text-foreground/85 md:text-base">
      {content
        .split(/\n{2,}/)
        .filter((p) => p.trim().length > 30)
        .slice(0, 40)
        .map((block, i) => {
          if (block.startsWith("•")) {
            const items = block.split("\n").filter((l) => l.trim());
            return (
              <ul key={i} className="space-y-1 pl-2">
                {items.map((item, j) => (
                  <li key={j} className="flex gap-2">
                    <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-foreground-muted" />
                    <span>{item.replace(/^•\s*/, "")}</span>
                  </li>
                ))}
              </ul>
            );
          }
          return <p key={i}>{block.trim()}</p>;
        })}
    </div>
  );
}

export function NewsModal({
  article,
  onClose,
}: {
  article: Article;
  onClose: () => void;
}) {
  const [contentState, setContentState] = useState<ContentState>({ status: "loading" });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  useEffect(() => {
    setContentState({ status: "loading" });
    const controller = new AbortController();

    fetch(`/api/article/content?url=${encodeURIComponent(article.sourceUrl)}`, {
      signal: controller.signal,
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.content) {
          setContentState({ status: "loaded", content: data.content, type: data.type });
        } else {
          setContentState({ status: "empty" });
        }
      })
      .catch(() => setContentState({ status: "error" }));

    return () => controller.abort();
  }, [article.sourceUrl]);

  return (
    <div className="fixed inset-0 z-50 flex items-stretch justify-center md:items-center md:p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
        className="absolute inset-0 bg-background/80 backdrop-blur-md"
      />

      <motion.article
        layoutId={`card-${article.id}`}
        className="relative z-10 flex w-full max-w-4xl flex-col overflow-hidden rounded-none bg-background-elevated shadow-[0_30px_80px_rgba(0,0,0,0.6)] md:max-h-[90vh] md:rounded-3xl md:border md:border-border-strong"
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Imagen / hero */}
        <motion.div
          layoutId={`media-${article.id}`}
          className="relative w-full shrink-0 overflow-hidden"
          style={{ aspectRatio: "21/8" }}
        >
          {article.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={article.imageUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full bg-aurora" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background-elevated via-background-elevated/50 to-transparent" />
          <button
            onClick={onClose}
            className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full border border-border-strong bg-background/70 text-foreground-muted backdrop-blur-md transition hover:bg-background hover:text-foreground"
            aria-label="Cerrar"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="absolute left-5 top-5">
            <CategoryBadge slug={article.category} />
          </div>
        </motion.div>

        {/* Cuerpo */}
        <motion.div
          layoutId={`body-${article.id}`}
          className="flex flex-1 flex-col gap-5 overflow-y-auto p-6 md:p-10"
        >
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <SourceBadge source={article.source} sourceName={article.sourceName} />
            <span className="text-[11px] uppercase tracking-[0.14em] text-foreground-faint">
              {timeAgo(article.publishedAt)}
            </span>
          </div>

          <motion.h1
            layoutId={`title-${article.id}`}
            className="text-2xl font-semibold leading-tight tracking-tight md:text-4xl"
          >
            {article.title}
          </motion.h1>

          <p className="text-base text-foreground-muted md:text-lg">{article.summary}</p>

          {/* Contenido completo */}
          <div className="border-t border-border pt-6">
            {contentState.status === "loading" && (
              <div className="flex items-center gap-3 py-10 text-foreground-muted">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">
                  {article.source === "github" ? "Cargando README…" : "Cargando artículo completo…"}
                </span>
              </div>
            )}

            {contentState.status === "loaded" && (
              <div>
                <div className="mb-5 flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-foreground-faint">
                  <BookOpen className="h-3.5 w-3.5" />
                  {contentState.type === "readme" ? "README del repositorio" : "Artículo completo"}
                </div>
                <ArticleContent content={contentState.content} />
              </div>
            )}

            {(contentState.status === "empty" || contentState.status === "error") && (
              <p className="py-4 text-sm text-foreground-faint">
                No se pudo cargar el contenido completo. Visita la fuente para leerlo.
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="mt-auto flex items-center justify-between border-t border-border pt-5">
            <span className="text-sm text-foreground-faint">Fuente original</span>
            <a
              href={article.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-border-strong bg-surface px-4 py-2 text-sm font-medium transition hover:bg-surface-hover"
            >
              {article.sourceName}
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </motion.div>
      </motion.article>
    </div>
  );
}
