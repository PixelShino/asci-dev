"use client";

import { useLocale } from "next-intl";

interface TerminalNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = ["HOME", "ABOUT", "PROJECTS", "CONTACT"];

export function TerminalNav({ activeTab, onTabChange }: TerminalNavProps) {
  const currentLocale = useLocale();

  const handleLocaleChange = (newLocale: string) => {
    if (newLocale === currentLocale) return;

    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;
    window.location.href = `/${newLocale}`;
  };

  return (
    <nav className="border-b border-[#b026ff]/20 bg-transparent">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-1 py-4">
          {tabs.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => onTabChange(tab)}
                className={`
                  dot-matrix text-sm px-4 py-2 transition-all duration-200
                  border border-transparent
                  ${
                    isActive
                      ? "text-[#b026ff] border-[#b026ff] neon-border-glow neon-glow"
                      : "text-[#888888] hover:text-[#e0e0e0] hover:border-[#b026ff]/30"
                  }
                `}>
                {"["} {tab} {"]"}
              </button>
            );
          })}

          <div className="flex-1" />

          <div className="flex items-center gap-6">
            <span className="text-[#888888] text-xs dot-matrix hidden sm:block">
              {"<"} NAVIGATE WITH TAB {">"}
            </span>

            <div className="flex items-center gap-2 text-sm font-mono">
              <button
                onClick={() => handleLocaleChange("en")}
                className={`transition-colors ${
                  currentLocale === "en"
                    ? "text-[#b026ff] neon-glow"
                    : "text-[#888888] hover:text-[#e0e0e0]"
                }`}>
                EN
              </button>
              <span className="text-[#888888]/50">|</span>
              <button
                onClick={() => handleLocaleChange("ru")}
                className={`transition-colors ${
                  currentLocale === "ru"
                    ? "text-[#b026ff] neon-glow"
                    : "text-[#888888] hover:text-[#e0e0e0]"
                }`}>
                RU
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
