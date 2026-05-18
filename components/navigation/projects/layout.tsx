"use client";

import { useState } from "react";
import { ProjectCard } from "./_components/ProjectCard";
import { ProjectDetails } from "./_components/ProjectDetails";

export type Project = {
  id: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  features: string[];
  techStack: string[];
  images: string[];
  githubUrl: string;
};

const PROJECTS: Project[] = [
  {
    id: "rulme",
    title: "Рули Сюда (Rulme)",
    shortDesc: "Сервис для...",
    fullDesc:
      "Полноценная платформа с проксированием API запросов к бэкенду. Оптимизирована работа с базой данных.",
    features: [
      "Proxy API",
      "Custom Routing",
      "Server-side Typescript services",
    ],
    techStack: ["Next.js", "TypeScript", "SQL", "API", "R3F"],
    images: ["/placeholder1.jpg", "/placeholder2.jpg"],
    githubUrl: "https://github.com/...",
  },
  {
    id: "tg-mini-app",
    title: "Telegram Mini-App",
    shortDesc: "Web App интеграция для Telegram бота.",
    fullDesc:
      "Мини-апп для экосистемы Telegram. Решены проблемы с Connect Timeout Error при обращении к Telegram API.",
    features: ["Telegram WebApps API", "Авторизация", "Адаптивный UI"],
    techStack: ["React", "Node.js", "Telegram API", "Tailwind"],
    images: ["/placeholder3.jpg"],
    githubUrl: "https://github.com/...",
  },
  {
    id: "admin-panel",
    title: "Admin Panel System",
    shortDesc: "Панель управления с защищенным доступом.",
    fullDesc:
      "Управление сертификатами (Certbot/SSL), мониторинг процессов (pm2) и настройка окружения.",
    features: ["Управление SSL", "Мониторинг логов", "Supabase интеграция"],
    techStack: ["Vue", "pm2", "Certbot", "Supabase"],
    images: ["/placeholder4.jpg"],
    githubUrl: "https://github.com/...",
  },
  {
    id: "bitovki",
    title: "Bitovki 36",
    shortDesc: "CRM для компании",
    fullDesc:
      "Управление сертификатами (Certbot/SSL), мониторинг процессов (pm2) и настройка окружения.",
    features: ["Управление SSL", "Мониторинг логов", "Supabase интеграция"],
    techStack: ["Vue", "pm2", "Certbot", "Supabase"],
    images: ["/placeholder4.jpg"],
    githubUrl: "https://github.com/...",
  },
];

export function ProjectsLayout() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <div className="min-h-[calc(100vh-280px)] border border-[#b026ff]/30 p-6 flex flex-col gap-4">
      <h2 className="text-[#b026ff] mb-4">
        {">"}{" "}
        {selectedProject
          ? `CAT ./PROJECTS/${selectedProject.id.toUpperCase()} █`
          : "LS -LA ./PROJECTS █"}
      </h2>

      {selectedProject ? (
        <ProjectDetails
          project={selectedProject}
          onBack={() => setSelectedProject(null)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROJECTS.map((p) => (
            <ProjectCard
              key={p.id}
              project={p}
              onClick={() => setSelectedProject(p)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
