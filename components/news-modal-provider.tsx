"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { NewsModal } from "./news-modal";
import type { Article } from "@/lib/types";

type Ctx = {
  selected: Article | null;
  open: (a: Article) => void;
  close: () => void;
};

const NewsModalContext = createContext<Ctx | null>(null);

export function NewsModalProvider({ children }: { children: React.ReactNode }) {
  const [selected, setSelected] = useState<Article | null>(null);
  const open = useCallback((a: Article) => setSelected(a), []);
  const close = useCallback(() => setSelected(null), []);

  return (
    <NewsModalContext.Provider value={{ selected, open, close }}>
      {children}
      <AnimatePresence>
        {selected && <NewsModal article={selected} onClose={close} />}
      </AnimatePresence>
    </NewsModalContext.Provider>
  );
}

export function useNewsModal(): Ctx {
  const ctx = useContext(NewsModalContext);
  if (!ctx) {
    throw new Error("useNewsModal must be used inside NewsModalProvider");
  }
  return ctx;
}
