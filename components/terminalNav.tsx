"use client";

import { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "next-themes";

interface TerminalNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const TABS = ["HOME", "ABOUT", "PROJECTS", "CONTACT"];

const STYLES = {
  nav: "border-b border-purple-400/20 bg-white dark:bg-black transition-colors duration-300 sticky top-0 z-50",
  tabActive:
    "text-purple-500 dark:text-purple-400 border-purple-500 dark:border-purple-400 bg-purple-500/5 dark:bg-purple-400/5 drop-shadow-[0_0_8px_rgba(168,85,247,0.4)]",
  tabInactive:
    "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 hover:border-purple-400/30 border-transparent",
  langActive:
    "text-purple-500 dark:text-purple-400 font-bold drop-shadow-[0_0_6px_rgba(168,85,247,0.3)]",
  langInactive:
    "text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200",
  mobileMenu:
    "md:hidden border-t border-purple-400/10 bg-white/95 dark:bg-black/95 backdrop-blur-md transition-all duration-200 overflow-hidden",
};

export function TerminalNav({ activeTab, onTabChange }: TerminalNavProps) {
  const currentLocale = useLocale();
  const t = useTranslations("Nav");

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLocaleChange = (newLocale: string) => {
    if (newLocale === currentLocale) return;

    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;

    localStorage.setItem("terminal_active_tab", activeTab);

    window.location.href = `/${newLocale}`;
  };

  const handleTabSelect = (tab: string) => {
    onTabChange(tab);
    setIsMenuOpen(false);
  };

  return (
    <nav className={STYLES.nav}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 font-mono">
          <div className="hidden md:flex items-center gap-2">
            {TABS.map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => handleTabSelect(tab)}
                  className={`text-sm px-4 py-2 border transition-all duration-200 ${
                    isActive ? STYLES.tabActive : STYLES.tabInactive
                  }`}>
                  {"["} {t(tab.toLowerCase())} {"]"}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden flex items-center justify-center p-2 border border-purple-400/30 text-purple-500 dark:text-purple-400 hover:bg-purple-400/5 transition-all"
            aria-label="Toggle menu">
            <span className="text-xs font-bold">
              [ {isMenuOpen ? t("close_menu") : t("open_menu")} ]
            </span>
          </button>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 border border-purple-400/20 hover:border-purple-400/50 text-zinc-500 dark:text-zinc-400 hover:text-purple-500 text-xs transition-all tracking-widest uppercase min-w-30">
              {!mounted
                ? t("loading")
                : theme === "dark"
                  ? t("light_mode")
                  : t("dark_mode")}
            </button>

            <div className="flex items-center gap-2 text-sm select-none">
              <button
                onClick={() => handleLocaleChange("en")}
                className={`transition-colors ${currentLocale === "en" ? STYLES.langActive : STYLES.langInactive}`}>
                EN
              </button>
              <span className="text-zinc-300 dark:text-zinc-700">|</span>
              <button
                onClick={() => handleLocaleChange("ru")}
                className={`transition-colors ${currentLocale === "ru" ? STYLES.langActive : STYLES.langInactive}`}>
                RU
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`${STYLES.mobileMenu} ${isMenuOpen ? "max-h-64 border-b pb-4" : "max-h-0"}`}>
        <div className="flex flex-col gap-2 px-4 pt-2">
          {TABS.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => handleTabSelect(tab)}
                className={`w-full text-left text-sm px-4 py-2 border transition-all duration-200 ${
                  isActive ? STYLES.tabActive : STYLES.tabInactive
                }`}>
                {"> "} {t(tab.toLowerCase())}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
