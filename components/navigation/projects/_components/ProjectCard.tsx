"use client";

import { Project } from "../layout";
import { TechBadges } from "./TechBadges";

interface Props {
  project: Project;
  onClick: () => void;
}

export function ProjectCard({ project, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      className="border border-[#888888]/30 p-4 cursor-pointer hover:border-[#b026ff] hover:bg-[#b026ff]/5 transition-all group">
      <div className="text-[#e0e0e0] font-bold mb-2 group-hover:text-[#b026ff]">
        [ {project.title} ]
      </div>
      <p className="text-[#888888] text-sm mb-4 line-clamp-2">
        {project.shortDesc}
      </p>

      {/* Здесь пока обычный маппинг, потом заменим на 3D Canvas */}
      <div className="flex flex-wrap gap-2">
        {project.techStack.slice(0, 3).map((tech) => (
          <span
            key={tech}
            className="text-xs text-[#b026ff]/70 border border-[#b026ff]/30 px-1">
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
}
