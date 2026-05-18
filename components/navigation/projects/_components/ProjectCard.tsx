"use client";

import { useTranslations } from "next-intl";
import { Project } from "../layout";
import { Button } from "@/components/ui/button";

interface Props {
  project: Project;
  onClick: () => void;
}

const STYLES = {
  card: "border border-zinc-400/20 p-4 cursor-pointer hover:border-purple-500 dark:hover:border-purple-400 hover:bg-purple-500/5 dark:hover:bg-purple-400/5 transition-all group rounded-sm bg-white/70 dark:bg-zinc-950/20",
  title:
    "text-zinc-800 dark:text-zinc-200 font-bold mb-2 group-hover:text-purple-600 dark:hover:text-purple-400 transition-colors text-sm md:text-base",
  desc: "text-zinc-500 dark:text-zinc-400 text-xs md:text-sm mb-4 line-clamp-2 leading-relaxed",
  badgeWrapper: "flex flex-wrap gap-2",
  badge:
    "text-xs text-purple-600 dark:text-purple-400 border border-purple-400/20 px-1.5 py-0.5 bg-purple-500/5 rounded-sm select-none",
};

export function ProjectCard({ project, onClick }: Props) {
  const t = useTranslations("Projects");

  return (
    <Button
      type="button"
      variant="ghost"
      onClick={onClick}
      className={`${STYLES.card} h-auto w-full flex-col items-stretch justify-start text-left whitespace-normal`}>
      <div className={STYLES.title}>[ {t(`${project.id}.title`)} ]</div>
      <p className={STYLES.desc}>{t(`${project.id}.shortDesc`)}</p>
      <div className={STYLES.badgeWrapper}>
        {project.techStack.slice(0, 3).map((tech) => (
          <span key={tech} className={STYLES.badge}>
            {tech}
          </span>
        ))}
      </div>
    </Button>
  );
}
