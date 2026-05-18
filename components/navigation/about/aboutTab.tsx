"use client";

import { useTranslations } from "next-intl";

const STYLES = {
  sectionTitle:
    "font-bold tracking-widest text-sm md:text-base uppercase text-purple-600 dark:text-purple-400",
  sectionContent:
    "leading-relaxed pl-3 border-l border-purple-400/30 text-zinc-600 dark:text-zinc-400 space-y-2",
};

export function AboutTab() {
  const t = useTranslations("About-tab");

  return (
    <div className="space-y-6 font-mono text-sm md:text-base text-zinc-800 dark:text-zinc-200 max-w-3xl animate-fadeIn">
      {/* ХЕДЕР ТАБА */}
      <div className="border-b border-purple-400/20 pb-4">
        <h2 className="text-purple-600 dark:text-purple-400 text-lg md:text-xl font-bold tracking-wider">
          {">"} {t("title")} <span className="cursor-blink">█</span>
        </h2>
      </div>

      {/* ОБЩАЯ ИНФОРМАЦИЯ */}
      <section className="space-y-2">
        <h3 className={STYLES.sectionTitle}>{t("section_overview")}</h3>
        <p className="leading-relaxed pl-3 border-l border-purple-400/30 text-zinc-600 dark:text-zinc-400">
          {t("overview_text")}
        </p>
      </section>

      {/* ПОДХОД К ЗАДАЧАМ */}
      <section className="space-y-2">
        <h3 className={STYLES.sectionTitle}>{t("section_workflow")}</h3>
        <div className={STYLES.sectionContent}>
          <p>{t("workflow_text_1")}</p>
          <p>{t("workflow_text_2")}</p>
        </div>
      </section>

      {/* РАБОТА С AI */}
      <section className="space-y-2">
        <h3 className={STYLES.sectionTitle}>{t("section_ai")}</h3>
        <div className={STYLES.sectionContent}>
          <p>{t("ai_text_1")}</p>
          <p>{t("ai_text_2")}</p>
        </div>
      </section>

      {/* ХОББИ */}
      <section className="space-y-2">
        <h3 className={STYLES.sectionTitle}>{t("section_hobby")}</h3>
        <div className={STYLES.sectionContent}>
          <p>{t("hobby_text_1")}</p>
          <p>{t("hobby_text_2")}</p>
        </div>
      </section>

      {/* ФУТЕР */}
      <div className="pt-2 border-t border-purple-400/10 text-xs text-zinc-400 dark:text-zinc-500 flex justify-between items-center">
        <span>EOF // CORE_PROFILE_RENDERED</span>
        <span>SYS_STATUS: OPTIMAL</span>
      </div>
    </div>
  );
}
