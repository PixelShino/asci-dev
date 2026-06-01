import Link from "next/link";

interface PostCardProps {
  href: string;
  title: string;
  excerpt?: string;
  dateLabel?: string;
  category?: string;
  coverUrl?: string;
  coverAlt?: string;
  readMoreLabel: string;
}

export function PostCard({
  href,
  title,
  excerpt,
  dateLabel,
  category,
  coverUrl,
  coverAlt,
  readMoreLabel,
}: PostCardProps) {
  return (
    <Link
      href={href}
      className="group flex flex-col border border-purple-400/20 bg-white dark:bg-zinc-900/30 rounded-sm overflow-hidden transition-all duration-300 hover:border-purple-400/50 hover:drop-shadow-[0_0_10px_rgba(168,85,247,0.2)]">
      {coverUrl && (
        <div className="aspect-[16/9] overflow-hidden border-b border-purple-400/10 bg-zinc-100 dark:bg-zinc-900">
          <img
            src={coverUrl}
            alt={coverAlt ?? title}
            className="w-full h-full object-cover opacity-90 transition-opacity duration-300 group-hover:opacity-100"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
        <div className="flex items-center gap-2 text-[11px] tracking-widest uppercase text-zinc-400 dark:text-zinc-500">
          {dateLabel && <span>{dateLabel}</span>}
          {category && (
            <>
              <span className="text-purple-400/50">/</span>
              <span className="text-purple-500 dark:text-purple-400">
                {category}
              </span>
            </>
          )}
        </div>
        <h2 className="text-base sm:text-lg font-bold leading-snug text-zinc-900 dark:text-zinc-100 transition-colors group-hover:text-purple-500 dark:group-hover:text-purple-400">
          <span className="text-purple-500 dark:text-purple-400">{"> "}</span>
          {title}
        </h2>
        {excerpt && (
          <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400 line-clamp-3">
            {excerpt}
          </p>
        )}
        <div className="mt-auto pt-1 text-xs tracking-widest uppercase text-purple-500 dark:text-purple-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          {"[ "}
          {readMoreLabel}
          {" → ]"}
        </div>
      </div>
    </Link>
  );
}
