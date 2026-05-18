"use client";

import { useTranslations } from "next-intl";
import { SkillIcon } from "@/components/ui/skill-icon";

type Skill = {
  id: string;
  name: string;
  customImage?: string;
  textOnly?: boolean;
};
type CategoryKey = "frontend" | "backend" | "tools";
type Category = { key: CategoryKey; label: string; skills: Skill[] };

const SKILL_CATEGORIES: Category[] = [
  {
    key: "frontend",
    label: "FRONT-END",
    skills: [
      { id: "react", name: "React" },
      { id: "nextjs", name: "Next.js" },
      { id: "threejs", name: "Three.js" },
      { id: "tailwind", name: "Tailwind CSS" },
      { id: "css", name: "CSS" },
      { id: "scss", name: "sCSS" },
      { id: "vite", name: "Vite" },
      { id: "figma", name: "figma" },
      { id: "html", name: "HTML" },
    ],
  },
  {
    key: "backend",
    label: "BACK-END",
    skills: [
      { id: "nodejs", name: "Node.js" },
      { id: "nestjs", name: "Nest JS" },
      { id: "supabase", name: "Supabase" },
      { id: "postgres", name: "PostgreSQL" },
      { id: "ts", name: "TypeScript" },
      { id: "js", name: "JavaScript" },
      { id: "redis", name: "redis" },
      { id: "bullmq", name: "bullmq", textOnly: true },
      { id: "zod", name: "zod", textOnly: true },
    ],
  },
  {
    key: "tools",
    label: "TOOLS",
    skills: [
      { id: "git", name: "Git" },
      { id: "github", name: "GitHub" },
      {
        id: "mobaxterm",
        name: "MobaXterm",
        customImage: "/skill/mobaxterm.png",
      },
      { id: "linux", name: "Linux" },
      { id: "vercel", name: "Vercel" },
      { id: "coolify", name: "Coolify", customImage: "/skill/coolify.png" },
      { id: "postman", name: "Postman" },
      { id: "tuna", name: "tuna tunnel", customImage: "/skill/tuna.png" },
      { id: "i18n", name: "i18n", textOnly: true },
      { id: "notion", name: "notion" },
      { id: "npm", name: "NPM" },
      { id: "pnpm", name: "PNPM" },
      { id: "ps", name: "Photoshop" },
      { id: "vscode", name: "vscode" },
    ],
  },
];

const STYLES = {
  sectionTitle: "text-purple-600 dark:text-purple-400 font-bold",
  mainBox:
    "border border-purple-400/20 bg-white/70 dark:bg-zinc-900/30 p-4 sm:p-6 space-y-10 w-full transition-colors duration-300",
  categoryLabel:
    "text-purple-600 dark:text-purple-400 text-xs font-bold font-mono shrink-0 uppercase tracking-wider select-none",
  lineDivider: "h-[1px] flex-1 bg-purple-500/20 dark:bg-purple-400/10",
  gridWrapper:
    "flex flex-wrap gap-x-8 gap-y-6 justify-start items-center w-full",
};

export function SkillsGrid() {
  const t = useTranslations("Skills");

  return (
    <section className="space-y-6 w-full">
      <div className="flex items-center justify-between font-mono select-none">
        <div className="flex items-center gap-2">
          <span className={STYLES.sectionTitle}>{">"}</span>
          <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100 tracking-wide">
            {t("title")}{" "}
            <span className="cursor-blink text-purple-600 dark:text-purple-400">
              █
            </span>
          </h2>
        </div>
      </div>

      <div className={STYLES.mainBox}>
        {SKILL_CATEGORIES.map((category) => (
          <div key={category.key} className="w-full space-y-5">
            <div className="flex items-center gap-4 w-full">
              <span className={STYLES.categoryLabel}>[{t(category.key)}]</span>
              <div className={STYLES.lineDivider} />
            </div>

            <div className={STYLES.gridWrapper}>
              {category.skills.map((skill) => (
                <SkillIcon
                  key={skill.id}
                  id={skill.id}
                  label={skill.name}
                  size={42}
                  customImage={skill.customImage}
                  textOnly={skill.textOnly}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
