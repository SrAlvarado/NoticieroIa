"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { CATEGORIES } from "@/lib/categories";
import { motion } from "framer-motion";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-6 px-5 md:px-8">
        <Link href="/" className="group flex items-center gap-2">
          <motion.span
            initial={{ rotate: 0 }}
            whileHover={{ rotate: 12 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="grid h-7 w-7 place-items-center rounded-md border border-border-strong bg-surface"
          >
            <Sparkles className="h-3.5 w-3.5 text-accent" />
          </motion.span>
          <span className="font-semibold tracking-tight">
            Noticiero<span className="text-gradient">IA</span>
          </span>
          <span className="hidden text-[11px] uppercase tracking-[0.18em] text-foreground-faint md:inline">
            · agregador personal
          </span>
        </Link>

        <nav className="hidden items-center gap-1 text-[13px] md:flex">
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              href={c.slug === "breaking" ? "/#breaking" : `/#${c.slug}`}
              className="rounded-full px-3 py-1.5 text-foreground-muted transition-colors hover:bg-surface-hover hover:text-foreground"
            >
              {c.short}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-foreground-muted">
          <span className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
          live
        </div>
      </div>
    </header>
  );
}
