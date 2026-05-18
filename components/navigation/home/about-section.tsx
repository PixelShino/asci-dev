"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

function Typewriter({ text, delay = 0 }: { text: string; delay?: number }) {
  const [output, setOutput] = useState("");

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    let interval: NodeJS.Timeout;

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
      {/* Invisible layer to reserve exact reflow space */}
      <span className="col-start-1 row-start-1 invisible">{text}</span>
      {/* Visible typing layer */}
      <span className="col-start-1 row-start-1">{output}</span>
    </span>
  );
}

const glassPanel =
  "bg-[#000000]/40 backdrop-blur-md border border-[#b026ff]/30 shadow-[0_0_15px_rgba(176,38,255,0.05)]";

export function AboutSection() {
  const t = useTranslations("About");

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-2">
        <span className="text-[#b026ff]">{">"}</span>
        <h2 className="text-xl text-[#e0e0e0] tracking-wide">{t("title")}</h2>
        <span className="cursor-blink text-[#b026ff]">█</span>
      </div>

      <div className={`p-6 space-y-4 ${glassPanel}`}>
        <div className="space-y-3">
          <p className="text-[#888888] text-sm leading-relaxed">
            <span className="text-[#b026ff]">$</span> cat ./profile.md
          </p>
          <div className="pl-4 border-l-2 border-[#b026ff]/30 space-y-3 font-mono text-sm">
            {/* Очищено от фиксированных h-[...] */}
            <p className="text-[#e0e0e0] leading-relaxed">
              <Typewriter text={t("role")} delay={0} />
            </p>
            <p className="text-[#e0e0e0] leading-relaxed">
              <Typewriter text={t("e2e")} delay={800} />
            </p>
            <p className="text-[#e0e0e0] leading-relaxed">
              <Typewriter text={t("frontend")} delay={2000} />
            </p>
            <p className="text-[#e0e0e0] leading-relaxed">
              <Typewriter text={t("backend")} delay={3200} />
            </p>
            <p className="text-[#e0e0e0] leading-relaxed">
              <Typewriter text={t("devops")} delay={4400} />
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-[#b026ff]/10">
          <p className="text-[#888888] text-sm mb-3">
            <span className="text-[#b026ff]">$</span> system --stats
          </p>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="border border-[#b026ff]/20 p-3 bg-[#000000]/20">
              <div className="text-2xl text-[#b026ff] neon-glow">2+</div>
              <div className="text-xs text-[#888888] mt-1">
                {t("years_exp")}
              </div>
            </div>
            <div className="border border-[#b026ff]/20 p-3 bg-[#000000]/20">
              <div className="text-2xl text-[#b026ff] neon-glow">11</div>
              <div className="text-xs text-[#888888] mt-1">{t("projects")}</div>
            </div>
            <div className="border border-[#b026ff]/20 p-3 bg-[#000000]/20">
              <div className="text-2xl text-[#b026ff] neon-glow">FULL</div>
              <div className="text-xs text-[#888888] mt-1">{t("stack")}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
