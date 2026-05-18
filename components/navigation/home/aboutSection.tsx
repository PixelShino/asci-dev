"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

interface AboutSectionProps {
  onContactClick?: () => void;
}

function Typewriter({ text, delay = 0 }: { text: string; delay?: number }) {
  const [output, setOutput] = useState("");

  useEffect(() => {
    // ИСПРАВЛЕНО: Теперь переменные хранят тип возвращаемого значения таймеров, а не саму функцию
    let timeout: ReturnType<typeof setTimeout>;
    let interval: ReturnType<typeof setInterval>;

    setOutput("");

    timeout = setTimeout(() => {
      let i = 0;
      interval = setInterval(() => {
        setOutput(text.substring(0, i + 1));
        i++;
        if (i >= text.length) clearInterval(interval);
      }, 15);
    }, delay);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [text, delay]);

  return (
    <span className="inline-grid">
      <span className="col-start-1 row-start-1 invisible">{text}</span>
      <span className="col-start-1 row-start-1">{output}</span>
    </span>
  );
}

const STYLES = {
  glassPanel:
    "bg-white dark:bg-zinc-950/40 border border-purple-400/20 shadow-[0_0_15px_rgba(168,85,247,0.02)] p-6 space-y-4 transition-colors duration-300",
  cliPath:
    "text-zinc-500 dark:text-zinc-500 text-sm leading-relaxed font-mono select-none",
  cliLogBorder:
    "pl-4 border-l-2 border-purple-500/30 dark:border-purple-400/20 space-y-3 font-mono text-sm text-zinc-800 dark:text-zinc-200",
  statBox:
    "border border-purple-400/20 bg-zinc-50 dark:bg-zinc-900/20 p-3 flex flex-col justify-center items-center rounded-sm transition-colors duration-300",
  statValue:
    "text-xl md:text-2xl text-purple-600 dark:text-purple-400 font-bold drop-shadow-[0_0_6px_rgba(168,85,247,0.2)]",
  btnExecute:
    "w-full border border-dashed border-purple-400/40 hover:border-purple-500 dark:hover:border-purple-400 bg-purple-500/5 hover:bg-purple-500/10 p-3 text-center transition-all duration-200 group text-sm font-mono",
};

export function AboutSection({ onContactClick }: AboutSectionProps) {
  const t = useTranslations("About");

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-2 font-mono select-none">
        <span className="text-purple-600 dark:text-purple-400">{">"}</span>
        <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100 tracking-wide">
          {t("title")}
        </h2>
        <span className="cursor-blink text-purple-600 dark:text-purple-400">
          █
        </span>
      </div>

      <div className={STYLES.glassPanel}>
        <div className="space-y-3">
          <div className={STYLES.cliPath}>
            <span className="text-purple-600 dark:text-purple-400">$</span> cat
            ./profile.md
          </div>
          <div className={STYLES.cliLogBorder}>
            <div className="leading-relaxed">
              <Typewriter text={t("role")} delay={0} />
            </div>
            <div className="leading-relaxed">
              <Typewriter text={t("e2e")} delay={800} />
            </div>
            <div className="leading-relaxed">
              <Typewriter text={t("frontend")} delay={1600} />
            </div>
            <div className="leading-relaxed">
              <Typewriter text={t("backend")} delay={2400} />
            </div>
            <div className="leading-relaxed">
              <Typewriter text={t("devops")} delay={3200} />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-purple-400/10">
          <div className={STYLES.cliPath}>
            <span className="text-purple-600 dark:text-purple-400">$</span>{" "}
            system --stats
          </div>
          <div className="grid grid-cols-3 gap-4 text-center font-mono mt-2">
            <div className={STYLES.statBox}>
              <div className={STYLES.statValue}>3.5</div>
              <div className="text-[11px] md:text-xs text-zinc-500 dark:text-zinc-400 mt-1 select-none">
                {t("years_exp")}
              </div>
            </div>
            <div className={STYLES.statBox}>
              <div className={STYLES.statValue}>11</div>
              <div className="text-[11px] md:text-xs text-zinc-500 dark:text-zinc-400 mt-1 select-none">
                {t("projects")}
              </div>
            </div>
            <div className={STYLES.statBox}>
              <div className={STYLES.statValue}>FULL</div>
              <div className="text-[11px] md:text-xs text-zinc-500 dark:text-zinc-400 mt-1 select-none">
                {t("stack")}
              </div>
            </div>
          </div>
        </div>

        {onContactClick && (
          <div className="pt-2">
            <button onClick={onContactClick} className={STYLES.btnExecute}>
              <span className="text-purple-600 dark:text-purple-400 font-bold ml-2 transition-all">
                {t("contact")}
              </span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
