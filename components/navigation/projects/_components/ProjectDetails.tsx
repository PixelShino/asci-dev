"use client";

import { Project } from "../layout";
import { TechBadges } from "./TechBadges";

interface Props {
  project: Project;
  onBack: () => void;
}

export function ProjectDetails({ project, onBack }: Props) {
  return (
    <div className="flex flex-col gap-6 text-[#e0e0e0] animate-in fade-in duration-300">
      <button
        onClick={onBack}
        className="self-start text-[#888888] hover:text-[#b026ff] transition-colors">
        {"<"} cd ..
      </button>

      <div className="border border-[#888888]/20 p-4">
        <h3 className="text-xl text-[#b026ff] mb-2">{project.title}</h3>
        <p className="text-[#888888] leading-relaxed mb-6">
          {project.fullDesc}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-[#b026ff]/70 mb-2">FEATURES:</h4>
            <ul className="list-none space-y-1">
              {project.features.map((f, i) => (
                <li key={i} className="text-sm">
                  <span className="text-[#b026ff] mr-2">*</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[#b026ff]/70 mb-2">TECH_STACK:</h4>
            <TechBadges items={project.techStack} />
          </div>
        </div>
      </div>

      <div className="border border-[#888888]/20 p-2 overflow-hidden">
        <div className="text-xs text-[#888888] mb-2"></div>
        <div className="flex gap-4 overflow-x-auto snap-x pb-2">
          {project.images.map((img, i) => (
            <div
              key={i}
              className="min-w-[300px] h-[200px] bg-[#111] border border-[#333] snap-center flex items-center justify-center">
              IMG_{i}.JPG
            </div>
          ))}
        </div>
      </div>

      <a
        href={project.githubUrl}
        target="_blank"
        rel="noreferrer"
        className="border border-[#b026ff] text-[#b026ff] p-2 text-center hover:bg-[#b026ff]/10">
        [ EXECUTE GITHUB_LINK ]
      </a>
    </div>
  );
}
