"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { ProjectCard } from "./_components/ProjectCard";
import { ProjectDetails } from "./_components/ProjectDetails";

export type Project = {
  id: string;
  techStack: string[];
  imageCount: number;
  githubUrl: string;
  featureCount: number;
  instanceId?: string;
  folderName: string;
};

const PROJECTS: Project[] = [
  {
    id: "t-catalog-admin",
    techStack: [
      "Next.js",
      "TypeScript",
      "Tailwind",
      "NestJS",
      "PostgreSQL",
      "BullMQ",
      "Redis",
      "Coolify",
      "SMTP",
      "Robokassa",
      "YooKassa",
    ],
    imageCount: 32,
    githubUrl: "https://github.com/...",
    featureCount: 3,
    folderName: "t-catalog-admin",
  },
  {
    id: "t-catalog-client",
    techStack: [
      "Next.js",
      "TypeScript",
      "Tailwind",
      "Redux Toolkit",
      "Supabase",
      "Coolify",
      "ZOD",
      "Grammy",
    ],
    imageCount: 12,
    githubUrl: "https://github.com/...",
    featureCount: 3,
    folderName: "t-catalog-client",
  },
  {
    id: "rulme-admin",
    techStack: [
      "Next.js",
      "TypeScript",
      "Node.js",
      "Supabase",
      "Tailwind",
      "Coolify",
    ],
    imageCount: 8,
    githubUrl: "https://github.com/...",
    featureCount: 3,
    folderName: "rulme-admin",
  },
  {
    id: "rulme-client",
    techStack: [
      "Next.js",
      "TypeScript",
      "REST",
      "TW",
      "PM2",
      "Grammy",
      "Coolify",
    ],
    imageCount: 19,
    githubUrl: "https://github.com/...",
    featureCount: 3,
    folderName: "rulme-client",
  },
  {
    id: "bitovki36",
    techStack: [
      "Next.js",
      "TypeScript",
      "Supabase",
      "TW",
      "Docker",
      "PM2",
      "Grammy",
    ],
    imageCount: 7,
    githubUrl: "https://github.com/...",
    featureCount: 3,
    folderName: "bitovki36",
  },
];

const STYLES = {
  container:
    "min-h-[calc(100vh-280px)] border border-purple-400/20 p-4 md:p-6 flex flex-col gap-4 bg-zinc-50 dark:bg-zinc-900/30 transition-colors duration-300",
  title:
    "text-purple-600 dark:text-purple-400 mb-4 text-base md:text-lg font-bold tracking-wider",
  grid: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 w-full",
  trigger:
    "h-12 w-full flex items-center justify-center text-xs text-zinc-400 font-mono tracking-widest uppercase select-none",
};

export function ProjectsLayout() {
  const t = useTranslations("Projects");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [visibleProjects, setVisibleProjects] = useState<Project[]>(() =>
    PROJECTS.map((p, i) => ({ ...p, instanceId: `${p.id}-init-${i}` })),
  );

  const triggerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (selectedProject) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && window.scrollY > 10) {
          setVisibleProjects((prev) => [
            ...prev,
            ...PROJECTS.map((p, index) => ({
              ...p,
              instanceId: `${p.id}-${prev.length}-${index}`,
            })),
          ]);
        }
      },
      { rootMargin: "100px" },
    );

    const currentTrigger = triggerRef.current;
    if (currentTrigger) {
      observer.observe(currentTrigger);
    }

    return () => {
      if (currentTrigger) {
        observer.unobserve(currentTrigger);
      }
      observer.disconnect();
    };
  }, [selectedProject]);

  const handleBack = () => {
    setSelectedProject(null);
    setVisibleProjects(
      PROJECTS.map((p, i) => ({ ...p, instanceId: `${p.id}-init-${i}` })),
    );
  };

  return (
    <div className={STYLES.container}>
      <h2 className={STYLES.title}>
        {">"}{" "}
        {selectedProject
          ? `CAT ./PROJECTS/${selectedProject.id.toUpperCase()}`
          : "LS -LA ./PROJECTS"}{" "}
        <span className="cursor-blink">█</span>
      </h2>

      {selectedProject ? (
        <ProjectDetails project={selectedProject} onBack={handleBack} />
      ) : (
        <>
          <div className={STYLES.grid}>
            {visibleProjects.map((p) => (
              <ProjectCard
                key={p.instanceId}
                project={p}
                onClick={() => setSelectedProject(p)}
              />
            ))}
          </div>
          <div ref={triggerRef} className={STYLES.trigger}>
            {"[ MEMORY_BUFFER: STREAMING_DATA... ]"}
          </div>
        </>
      )}
    </div>
  );
}
