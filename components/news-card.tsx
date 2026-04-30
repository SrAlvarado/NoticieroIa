"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { CategoryBadge } from "./category-badge";
import { SourceBadge } from "./source-badge";
import { useNewsModal } from "./news-modal-provider";
import { timeAgo } from "@/lib/format";
import type { Article } from "@/lib/types";

export function NewsCard({
  article,
  variant = "default",
  index = 0,
}: {
  article: Article;
  variant?: "default" | "feature" | "compact";
  index?: number;
}) {
  const { open, selected } = useNewsModal();
  const isFeature = variant === "feature";
  const isCompact = variant === "compact";
  const isHidden = selected?.id === article.id;

  return (
    <motion.button
      type="button"
      layoutId={`card-${article.id}`}
      onClick={() => open(article)}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: isHidden ? 0 : 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: Math.min(index * 0.04, 0.3),
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -2 }}
      className={`group relative block w-full overflow-hidden rounded-2xl border border-border bg-surface text-left transition-colors hover:border-border-strong hover:bg-surface-hover ${
        isFeature ? "md:col-span-2 md:row-span-2" : ""
      }`}
    >
      <motion.div
        layoutId={`media-${article.id}`}
        className={`relative w-full overflow-hidden ${
          isFeature ? "aspect-[16/10]" : isCompact ? "aspect-[16/8]" : "aspect-[16/9]"
        }`}
      >
        {article.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={article.imageUrl}
            alt=""
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            loading="lazy"
          />
        ) : (
          <div className="h-full w-full bg-aurora" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent opacity-90" />
        <div className="absolute left-3 top-3">
          <CategoryBadge slug={article.category} />
        </div>
      </motion.div>

      <motion.div
        layoutId={`body-${article.id}`}
        className={`flex flex-col gap-3 p-5 ${isFeature ? "md:p-7" : ""}`}
      >
        <div className="flex items-center justify-between gap-3">
          <SourceBadge source={article.source} sourceName={article.sourceName} />
          <span className="text-[11px] uppercase tracking-[0.14em] text-foreground-faint">
            {timeAgo(article.publishedAt)}
          </span>
        </div>

        <motion.h3
          layoutId={`title-${article.id}`}
          className={`font-semibold tracking-tight text-foreground line-clamp-3 ${
            isFeature ? "text-2xl md:text-3xl" : "text-base md:text-lg"
          }`}
        >
          {article.title}
        </motion.h3>

        {!isCompact && (
          <p
            className={`text-foreground-muted line-clamp-2 ${
              isFeature ? "text-base" : "text-sm"
            }`}
          >
            {article.summary}
          </p>
        )}

        <div className="mt-1 flex items-center gap-1.5 text-[12px] text-foreground-muted opacity-0 transition-opacity group-hover:opacity-100">
          Abrir
          <ArrowUpRight className="h-3.5 w-3.5" />
        </div>
      </motion.div>
    </motion.button>
  );
}
