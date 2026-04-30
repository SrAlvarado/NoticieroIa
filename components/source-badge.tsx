import { GitBranch, MessageCircle, Rss, AtSign } from "lucide-react";
import type { SourceKind } from "@/lib/types";

const ICON: Record<SourceKind, typeof GitBranch> = {
  github: GitBranch,
  reddit: MessageCircle,
  rss: Rss,
  twitter: AtSign,
  mastodon: AtSign,
};

export function SourceBadge({
  source,
  sourceName,
  className = "",
}: {
  source: SourceKind;
  sourceName: string;
  className?: string;
}) {
  const Icon = ICON[source];
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.14em] text-foreground-muted ${className}`}
    >
      <Icon className="h-3 w-3" />
      <span>{sourceName}</span>
    </span>
  );
}
