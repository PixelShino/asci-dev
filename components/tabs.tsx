"use client";

import { useState, useEffect } from "react";
import { TerminalNav } from "@/components/terminalNav";
import { TerminalHeader } from "@/components/terminalHeader";
import { AsciiAnim } from "@/components/navigation/home/asciiAnim";
import { AboutSection } from "@/components/navigation/home/aboutSection";
import { SkillsGrid } from "@/components/navigation/home/skillsGrid";
import { SocialFooter } from "@/components/socialFooter";
import { ProjectsLayout, type Project } from "@/components/navigation/projects/layout";
import { ContactForm } from "./navigation/contact/contactForm";
import { AboutTab } from "./navigation/about/aboutTab";
import { AiAssistant } from "./navigation/home/aiAssistant";

const STYLES = {
  mainWrapper:
    "min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-200 font-mono relative scanlines transition-colors duration-300",
  innerTabWrapper: "w-full px-3 sm:px-4 lg:px-6 py-3 lg:py-4",
  tabContainer:
    "min-h-[calc(100dvh-200px)] border border-purple-400/20 p-6 bg-white dark:bg-zinc-900/30 rounded-sm transition-colors duration-300",
};

export default function PortfolioClient({ projects }: { projects: Project[] }) {
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
      <TerminalHeader />

      <TerminalNav activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="relative z-10">
        <div className={activeTab === "HOME" ? "block" : "hidden"}>
          <div className="flex flex-row gap-3 sm:gap-4 lg:gap-6 px-3 sm:px-4 lg:px-6 py-3 lg:py-4 h-[calc(100dvh-200px)] animate-fadeIn">
            <div className="shrink-0 w-14 sm:w-20 md:w-28 lg:w-72 xl:w-80 h-full">
              <AsciiAnim />
            </div>

            <div className="flex-1 min-w-0 h-full overflow-y-auto pr-1 sm:pr-2">
              <div className="flex flex-col gap-4 sm:gap-5">
                <AboutSection onContactClick={() => setActiveTab("CONTACT")} />
                <AiAssistant />
                <SkillsGrid />
              </div>
            </div>
          </div>
        </div>

        <div className={activeTab === "ABOUT" ? "block" : "hidden"}>
          <div className={STYLES.innerTabWrapper}>
            <div className={STYLES.tabContainer}>
              <AboutTab />
            </div>
          </div>
        </div>

        <div className={activeTab === "PROJECTS" ? "block" : "hidden"}>
          <div className="w-full px-3 sm:px-4 lg:px-6 py-3 lg:py-4">
            <ProjectsLayout projects={projects} />
          </div>
        </div>

        <div className={activeTab === "CONTACT" ? "block" : "hidden"}>
          <div className={STYLES.innerTabWrapper}>
            <div className={STYLES.tabContainer}>
              <ContactForm />
            </div>
          </div>
        </div>
      </main>

      <SocialFooter />
    </div>
  );
}
