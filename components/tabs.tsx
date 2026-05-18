"use client";

import { useState, useEffect } from "react";
import { TerminalNav } from "@/components/terminalNav";
import { AsciModelViewer } from "@/components/navigation/home/modelViewer";
import { AboutSection } from "@/components/navigation/home/aboutSection";
import { SkillsGrid } from "@/components/navigation/home/skillsGrid";
import { SocialFooter } from "@/components/socialFooter";
import { ProjectsLayout } from "@/components/navigation/projects/layout";
import { ContactForm } from "./navigation/contact/contactForm";
import { AboutTab } from "./navigation/about/aboutTab";
import { AiAssistant } from "./navigation/home/aiAssistant";

const STYLES = {
  mainWrapper:
    "min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-200 font-mono relative scanlines transition-colors duration-300",
  header:
    "border-b border-purple-400/20 p-4 bg-white/80 dark:bg-black/50 backdrop-blur-md transition-colors duration-300",
  tabContainer:
    "min-h-[calc(100vh-280px)] border border-purple-400/20 p-6 bg-white dark:bg-zinc-900/30 rounded-sm transition-colors duration-300",
};

export default function PortfolioClient() {
  const [activeTab, setActiveTab] = useState("HOME");

  useEffect(() => {
    const savedTab = localStorage.getItem("terminal_active_tab");
    if (savedTab) {
      setActiveTab(savedTab);
      localStorage.removeItem("terminal_active_tab");
    }
  }, []);

  return (
    <div className={STYLES.mainWrapper}>
      <header className={STYLES.header}>
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-2 select-none">
            <span className="text-purple-500 dark:text-purple-400">{">"}</span>
            <span className="tracking-wider font-bold">DMITRII-GOLDOBIN</span>
            <span className="cursor-blink text-purple-500 dark:text-purple-400">
              █
            </span>
          </div>
          <div className="text-zinc-400 dark:text-zinc-500 text-xs tracking-widest">
            v1.0.1
          </div>
        </div>
      </header>

      <TerminalNav activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="max-w-7xl mx-auto p-6 relative z-10">
        <div className={activeTab === "HOME" ? "block" : "hidden"}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-[calc(100vh-280px)] animate-fadeIn items-stretch relative">
            <div className="lg:col-span-5 h-full w-full">
              <AsciModelViewer />
            </div>

            <div className="lg:col-span-7 flex flex-col gap-8 w-full">
              <AboutSection onContactClick={() => setActiveTab("CONTACT")} />
              <AiAssistant />
              <SkillsGrid />
            </div>
          </div>
        </div>

        <div className={activeTab === "ABOUT" ? "block" : "hidden"}>
          <div className={STYLES.tabContainer}>
            <AboutTab />
          </div>
        </div>

        <div className={activeTab === "PROJECTS" ? "block" : "hidden"}>
          <ProjectsLayout />
        </div>

        <div className={activeTab === "CONTACT" ? "block" : "hidden"}>
          <div className={STYLES.tabContainer}>
            <ContactForm />
          </div>
        </div>
      </main>

      <SocialFooter />
    </div>
  );
}
