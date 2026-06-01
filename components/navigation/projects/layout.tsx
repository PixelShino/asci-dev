"use client";

import { useState, useEffect, useRef } from "react";
import { ProjectCard } from "./_components/ProjectCard";
import { ProjectDetails } from "./_components/ProjectDetails";

// Данные проектов приходят из Payload (см. app/[locale]/page.tsx) уже
// локализованными — тексты прямо в объекте, без next-intl per-project.
export type Project = {
  id: number;
  slug: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  features: string[];
  techStack: string[];
  githubUrl?: string;
  images: string[];
  instanceId?: string;
};

const STYLES = {
  container:
    "min-h-[calc(100vh-280px)] border border-purple-400/20 p-4 md:p-6 flex flex-col gap-4 bg-zinc-50 dark:bg-zinc-900/30 transition-colors duration-300",
  title:
    "text-purple-600 dark:text-purple-400 mb-4 text-base md:text-lg font-bold tracking-wider",
  grid: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 w-full",
  trigger:
    "h-12 w-full flex items-center justify-center text-xs text-zinc-400 font-mono tracking-widest uppercase select-none",
};

export function ProjectsLayout({ projects }: { projects: Project[] }) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [visibleProjects, setVisibleProjects] = useState<Project[]>(() =>
    projects.map((p, i) => ({ ...p, instanceId: `${p.slug}-init-${i}` })),
  );

  const triggerRef = useRef<HTMLDivElement | null>(null);

  // Источник данных мог измениться (смена локали / правки в админке) —
  // держим базовый список в синхроне, пока не открыта карточка проекта.
  useEffect(() => {
    if (selectedProject) return;
    setVisibleProjects(
      projects.map((p, i) => ({ ...p, instanceId: `${p.slug}-init-${i}` })),
    );
  }, [projects, selectedProject]);

  useEffect(() => {
    if (selectedProject) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && window.scrollY > 10) {
          setVisibleProjects((prev) => [
            ...prev,
            ...projects.map((p, index) => ({
              ...p,
              instanceId: `${p.slug}-${prev.length}-${index}`,
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
  }, [selectedProject, projects]);

  const handleBack = () => {
    setSelectedProject(null);
    setVisibleProjects(
      projects.map((p, i) => ({ ...p, instanceId: `${p.slug}-init-${i}` })),
    );
  };

  return (
    <div className={STYLES.container}>
      <h2 className={STYLES.title}>
        {">"}{" "}
        {selectedProject
          ? `CAT ./PROJECTS/${selectedProject.slug.toUpperCase()}`
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
