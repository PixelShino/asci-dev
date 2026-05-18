"use client";

import { useState } from "react";
import { TerminalNav } from "@/components/terminal-nav";
import { AsciModelViewer } from "@/components/navigation/home/ascii-placeholder";
import { AboutSection } from "@/components/navigation/home/about-section";
import { SkillsGrid } from "@/components/navigation/home/skills-grid";
import { SocialFooter } from "@/components/social-footer";
import { ProjectsLayout } from "@/components/navigation/projects/layout";

export default function PortfolioClient() {
  const [activeTab, setActiveTab] = useState("HOME");

  return (
    <div className="min-h-screen bg-[#000000]/30 backdrop-blur-sm text-[#e0e0e0] font-mono relative scanlines">
      <header className="border-b border-[#b026ff]/30 p-4 bg-[#000000]/50 backdrop-blur-md">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <span className="text-[#b026ff] neon-glow">{">"}</span>
            <span className="text-[#e0e0e0] tracking-wider">
              DMITRII-GOLDOBIN.SYS
            </span>
            <span className="cursor-blink text-[#b026ff]">█</span>
          </div>
          <div className="text-[#888888] text-xs">v1.0.0 // STATUS: ONLINE</div>
        </div>
      </header>

      <TerminalNav activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="max-w-7xl mx-auto p-6">
        {activeTab === "HOME" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-[calc(100vh-280px)]">
            <AsciModelViewer />

            <div className="flex flex-col gap-8">
              <AboutSection />
              <SkillsGrid />
            </div>
          </div>
        )}

        {activeTab === "ABOUT" && (
          <div className="min-h-[calc(100vh-280px)] border border-[#b026ff]/30 p-6">
            <h2 className="text-[#b026ff] mb-4">{">"} CAT ABOUT.TXT █</h2>
            <p className="text-[#888888]">// Инициализация подробного био...</p>
          </div>
        )}

        {activeTab === "PROJECTS" && <ProjectsLayout />}

        {activeTab === "CONTACT" && (
          <div className="min-h-[calc(100vh-280px)] border border-[#b026ff]/30 p-6">
            <h2 className="text-[#b026ff] mb-4">{">"} PING CONTACT_API █</h2>
            <p className="text-[#888888]">Ожидание входящих пакетов...</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <SocialFooter />
    </div>
  );
}
