import { SkillIcon } from "@/components/ui/skill-icon";

type Skill = { id: string; name: string; customImage?: string };
type Category = { label: string; skills: Skill[] };

const skillCategories: Category[] = [
  {
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
      { id: "html", name: "figma" },
    ],
  },
  {
    label: "BACK-END",
    skills: [
      { id: "nodejs", name: "Node.js" },
      { id: "nestjs", name: "Nest JS" },

      { id: "supabase", name: "Supabase" },
      { id: "postgres", name: "PostgreSQL" },
      { id: "ts", name: "TypeScript" },
      { id: "js", name: "JavaScript" },
      { id: "nodejs", name: "nodejs" },
      { id: "redis", name: "redis" },
      { id: "bullmq", name: "bullmq", customImage: "/skill/bullmq.png" },
      { id: "zod", name: "zod" },
    ],
  },
  {
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
      { id: "i18n", name: "i18n" },
      { id: "notion", name: "notion" },
      { id: "npm", name: "NPM" },
      { id: "pnpm", name: "PNPM" },
      { id: "ps", name: "Photoshop" },
      { id: "vscode", name: "vscode" },
    ],
  },
];

export function SkillsGrid() {
  return (
    <section className="space-y-6 w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[#b026ff]">{">"}</span>
          <h2 className="text-xl text-[#e0e0e0] tracking-wide">
            SYSTEM_SKILLS
          </h2>
        </div>
      </div>

      <div className="border border-[#b026ff]/20 bg-[#000000] p-4 sm:p-6 space-y-10 w-full">
        {skillCategories.map((category) => (
          <div key={category.label} className="w-full space-y-5">
            <div className="flex items-center gap-4 w-full">
              <span className="text-[#b026ff] text-xs font-bold font-mono shrink-0 uppercase tracking-wider">
                [{category.label}]
              </span>
              <div className="h-[1px] flex-1 bg-[#b026ff]/10" />
            </div>

            <div className="flex flex-wrap gap-x-8 gap-y-6 justify-start items-center w-full">
              {category.skills.map((skill) => (
                <SkillIcon
                  key={skill.id}
                  id={skill.id}
                  label={skill.name}
                  size={42}
                  customImage={skill.customImage}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
