// Общий «терминальный» хедер сайта: используется и на главной (`tabs.tsx`),
// и в роутах блога (`app/[locale]/blog`). Без клиентских хуков.

const STYLES = {
  header:
    "border-b border-purple-400/20 p-4 bg-white/80 dark:bg-black/50 backdrop-blur-md transition-colors duration-300",
};

export function TerminalHeader() {
  return (
    <header className={STYLES.header}>
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2 select-none">
          <span className="text-purple-500 dark:text-purple-400">{">"}</span>
          <span className="tracking-wider font-bold">DMITRII-GOLDOBIN</span>
          <span className="cursor-blink text-purple-500 dark:text-purple-400">
            █
          </span>
        </div>
        <div className="text-zinc-400 dark:text-zinc-500 text-xs tracking-widest">
          v1.0.1
        </div>
      </div>
    </header>
  );
}
