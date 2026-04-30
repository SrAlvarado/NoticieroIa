import { getCategory } from "@/lib/categories";

export function CategoryBadge({
  slug,
  className = "",
}: {
  slug: string;
  className?: string;
}) {
  const meta = getCategory(slug);
  if (!meta) return null;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.18em] ${className}`}
      style={{
        borderColor: `${meta.accent}60`,
        color: meta.accent,
        background: `${meta.accent}18`,
        boxShadow: `0 0 8px ${meta.accent}30`,
      }}
    >
      <span
        className="inline-block h-1.5 w-1.5 rounded-full"
        style={{ background: meta.accent }}
      />
      {meta.short}
    </span>
  );
}
