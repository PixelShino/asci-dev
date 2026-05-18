"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

export type GlitchMode = "normal" | "glitch" | "ascii";

interface GlitchContextType {
  mode: GlitchMode;
}

const GlitchContext = createContext<GlitchContextType>({ mode: "normal" });

export function useGlitch() {
  return useContext(GlitchContext);
}

export function GlitchProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<GlitchMode>("normal");

  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setMode("glitch");

      setTimeout(() => setMode("ascii"), 300);

      setTimeout(() => setMode("glitch"), 3000);

      setTimeout(() => setMode("normal"), 3300);
    }, 8000);

    return () => clearInterval(glitchInterval);
  }, []);

  return (
    <GlitchContext.Provider value={{ mode }}>{children}</GlitchContext.Provider>
  );
}
