"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { ExternalLink, X } from "lucide-react";
import { CategoryBadge } from "./category-badge";
import { SourceBadge } from "./source-badge";
import { timeAgo } from "@/lib/format";
import type { Article } from "@/lib/types";

export function NewsModal({
  article,
  onClose,
}: {
  article: Article;
  onClose: () => void;
}) {
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
        className="relative z-10 flex w-full max-w-4xl flex-col overflow-hidden rounded-none border-none bg-background-elevated shadow-[0_30px_80px_rgba(0,0,0,0.6)] md:max-h-[88vh] md:rounded-3xl md:border md:border-border-strong"
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          layoutId={`media-${article.id}`}
          className="relative aspect-[16/9] w-full overflow-hidden md:aspect-[21/9]"
        >
          {article.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={article.imageUrl}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-aurora" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background-elevated via-background-elevated/40 to-transparent" />
          <button
            onClick={onClose}
            className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full border border-border-strong bg-background/70 text-foreground-muted backdrop-blur-md transition hover:bg-background hover:text-foreground"
            aria-label="Cerrar"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="absolute left-5 top-5 md:left-7 md:top-7">
            <CategoryBadge slug={article.category} />
          </div>
        </motion.div>

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
            className="text-3xl font-semibold tracking-tight md:text-4xl"
          >
            {article.title}
          </motion.h1>

          <p className="text-lg text-foreground-muted">{article.summary}</p>

          {article.content && (
            <div className="prose prose-invert max-w-none text-base leading-relaxed text-foreground/90">
              {article.content.split("\n\n").map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          )}

          <div className="mt-2 flex items-center justify-between border-t border-border pt-5">
            <span className="text-sm text-foreground-faint">
              Fuente original
            </span>
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
