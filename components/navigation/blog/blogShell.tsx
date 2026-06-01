// Терминальная оболочка для роутов блога: тот же хедер / навигация / футер,
// что и на главной. Рендерится из `app/[locale]/blog/layout.tsx`, поэтому
// сохраняется между списком и постом (скелетоны меняют только контент).

import { TerminalHeader } from "@/components/terminalHeader";
import { TerminalNav } from "@/components/terminalNav";
import { SocialFooter } from "@/components/socialFooter";

const STYLES = {
  mainWrapper:
    "min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-200 font-mono relative scanlines transition-colors duration-300",
  content: "w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 lg:py-6",
};

export function BlogShell({ children }: { children: React.ReactNode }) {
  return (
    <div className={STYLES.mainWrapper}>
      <TerminalHeader />
      <TerminalNav />
      <main className="relative z-10 min-h-[calc(100dvh-200px)]">
        <div className={STYLES.content}>{children}</div>
      </main>
      <SocialFooter />
    </div>
  );
}
