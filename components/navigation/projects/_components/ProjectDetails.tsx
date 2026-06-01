"use client";

import { useTranslations } from "next-intl";
import { Project } from "../layout";
import { TechBadges } from "./TechBadges";
import { MediaViewer } from "@/components/mediaViewer";
import { Button } from "@/components/ui/button";

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
  btnGithubLink:
    "border border-purple-400/40 text-purple-600 dark:text-purple-400 hover:bg-purple-500/5 p-3 flex items-center justify-center gap-2 text-sm font-bold tracking-wider rounded-sm transition-colors",
};

export function ProjectDetails({ project, onBack }: Props) {
  // Лейблы остаются в next-intl; тексты проекта приходят локализованными в data.
  const t = useTranslations("Projects");

  return (
    <div className={STYLES.container}>
      <Button
        type="button"
        variant="ghost"
        onClick={onBack}
        className={STYLES.btnBack}>
        {"<"} cd ..
      </Button>

      <div className={STYLES.mainBox}>
        <h3 className={STYLES.title}>{project.title}</h3>
        <p className={STYLES.desc}>{project.fullDesc}</p>

        <div className={STYLES.grid}>
          <div>
            <h4 className={STYLES.heading}>{t("features_label")}</h4>
            <ul className={STYLES.list}>
              {project.features.map((feature, i) => (
                <li key={i}>
                  <span className={STYLES.bullet}>*</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className={STYLES.heading}>{t("stack_label")}</h4>
            <TechBadges items={project.techStack} />
          </div>
        </div>
      </div>

      {project.githubUrl ? (
        <a
          href={project.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={STYLES.btnGithubLink}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4 shrink-0">
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
          </svg>
          <span>GITHUB</span>
        </a>
      ) : (
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
      )}

      {project.images.length > 0 && (
        <div className={STYLES.galleryBox}>
          <MediaViewer images={project.images} view="grid" hideHeader={true} />
        </div>
      )}
    </div>
  );
}
