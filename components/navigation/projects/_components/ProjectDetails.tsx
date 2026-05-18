"use client";

import { useTranslations } from "next-intl";
import { Project } from "../layout";
import { TechBadges } from "./TechBadges";
import { MediaViewer } from "@/components/mediaViewer";

interface Props {
  project: Project;
  onBack: () => void;
}

const STYLES = {
  container:
    "flex flex-col gap-6 text-zinc-800 dark:text-zinc-200 animate-fadeIn font-mono text-sm md:text-base",
  btnBack:
    "self-start px-5 py-2.5 rounded-sm bg-white/90 dark:bg-zinc-950/60 hover:bg-zinc-100 dark:hover:bg-zinc-900 border-2 border-purple-600 dark:border-purple-400 text-zinc-800 dark:text-zinc-200 text-sm md:text-base font-bold active:scale-95 transition-all shadow-[0_0_10px_rgba(168,85,247,0.15)] flex items-center gap-2 z-10 cursor-pointer",
  mainBox:
    "border border-zinc-400/20 p-5 bg-white dark:bg-zinc-950/10 rounded-sm transition-colors",
  title:
    "text-lg md:text-xl font-bold text-purple-600 dark:text-purple-400 mb-2",
  desc: "text-zinc-500 dark:text-zinc-400 leading-relaxed mb-6 text-xs md:text-sm",
  grid: "grid grid-cols-1 md:grid-cols-2 gap-6",
  heading:
    "text-xs font-bold tracking-wider text-purple-500 dark:text-purple-400/70 mb-2 select-none",
  list: "list-none space-y-1.5 text-xs md:text-sm text-zinc-600 dark:text-zinc-300",
  bullet: "text-purple-600 dark:text-purple-400 mr-2 font-bold",
  galleryBox:
    "border border-zinc-400/20 p-3 bg-white dark:bg-zinc-950/10 rounded-sm",
  btnGithub:
    "border border-zinc-400/30 dark:border-zinc-800 text-zinc-400 dark:text-zinc-600 p-3 flex items-center justify-center gap-2 text-sm font-bold tracking-wider rounded-sm bg-zinc-100/50 dark:bg-zinc-950/30 select-none",
};

export function ProjectDetails({ project, onBack }: Props) {
  const t = useTranslations("Projects");

  const imageUrls = Array.from({ length: project.imageCount }).map((_, i) => {
    const fileIndex = project.id === "rulme-client" && i >= 2 ? i + 1 : i;
    return `/projects/${project.folderName}/${fileIndex}.webp`;
  });

  return (
    <div className={STYLES.container}>
      <button onClick={onBack} className={STYLES.btnBack}>
        {"<"} cd ..
      </button>

      <div className={STYLES.mainBox}>
        <h3 className={STYLES.title}>{t(`${project.id}.title`)}</h3>
        <p className={STYLES.desc}>{t(`${project.id}.fullDesc`)}</p>

        <div className={STYLES.grid}>
          <div>
            <h4 className={STYLES.heading}>{t("features_label")}</h4>
            <ul className={STYLES.list}>
              {Array.from({ length: project.featureCount }).map((_, i) => {
                const translationKey = `${project.id}.features.${i}`;

                if (!t.has(translationKey)) return null;

                return (
                  <li key={i}>
                    <span className={STYLES.bullet}>*</span>
                    {t(translationKey)}
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <h4 className={STYLES.heading}>{t("stack_label")}</h4>
            <TechBadges items={project.techStack} />
          </div>
        </div>
      </div>

      <div className={STYLES.btnGithub}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4 shrink-0 opacity-70">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
        <span>{t("github_private")}</span>
      </div>

      {imageUrls.length > 0 && (
        <div className={STYLES.galleryBox}>
          <MediaViewer images={imageUrls} view="grid" hideHeader={true} />
        </div>
      )}
    </div>
  );
}
