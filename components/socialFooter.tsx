"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

const SOCIAL_LINKS = [
  { label: "GH", href: "https://github.com/pixelshino", title: "GitHub" },
  { label: "TG", href: "https://t.me/pixelshino", title: "Telegram" },
];

const STYLES = {
  footer:
    "border-t border-purple-400/20 bg-white dark:bg-black mt-auto transition-colors duration-300",
  wrapper: "max-w-7xl mx-auto px-6 py-6 font-mono",
  link: "border border-purple-400/30 px-3 py-1 text-zinc-700 dark:text-zinc-200 text-sm hover:border-purple-500 dark:hover:border-purple-400 hover:text-purple-500 dark:hover:text-purple-400 hover:bg-purple-400/5 transition-all duration-200",
  statusBlock:
    "flex items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400",
  terminalLine:
    "mt-4 pt-4 border-t border-purple-400/10 flex items-center gap-2 text-sm",
};

export function SocialFooter() {
  const t = useTranslations("Footer");

  return (
    <footer className={STYLES.footer}>
      <div className={STYLES.wrapper}>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="text-zinc-400 dark:text-zinc-500 text-sm font-bold">
              {t("connect")}:
            </span>
            <div className="flex items-center gap-2">
              {SOCIAL_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={link.title}
                  className={STYLES.link}>
                  [{link.label}]
                </Link>
              ))}
            </div>
          </div>

          <div className={STYLES.statusBlock}>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              {t("status")}
            </span>
            <span className="text-zinc-300 dark:text-zinc-800">|</span>
            <span>© 2026 PixelShino</span>
          </div>
        </div>

        <div className={STYLES.terminalLine}>
          <span className="text-purple-600 dark:text-purple-400 font-bold">
            guest@portfolio
          </span>
          <span className="text-zinc-400 dark:text-zinc-600">:</span>
          <span className="text-purple-600 dark:text-purple-400">~</span>
          <span className="text-zinc-400 dark:text-zinc-600">$</span>
          <span className="text-zinc-800 dark:text-zinc-200">
            echo "{t("thanks_msg")}"
          </span>
          <span className="cursor-blink text-purple-500 dark:text-purple-400">
            █
          </span>
        </div>
      </div>
    </footer>
  );
}
