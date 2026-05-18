"use client";

interface Props {
  items: string[];
}

const STYLES = {
  wrapper:
    "relative w-full min-h-24 border border-dashed border-zinc-400/20 bg-white dark:bg-zinc-950/40 p-3 rounded-sm transition-colors duration-300",
  badgeContainer: "flex flex-wrap gap-2",
  badge:
    "bg-purple-500/5 dark:bg-purple-400/10 text-zinc-800 dark:text-zinc-200 border border-purple-400/30 px-2 py-1 text-xs md:text-sm inline-block rounded-sm transition-colors",
};

export function TechBadges({ items }: Props) {
  return (
    <div className={STYLES.wrapper}>
      <div className={STYLES.badgeContainer}>
        {items.map((tech) => (
          <span key={tech} className={STYLES.badge}>
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
}
