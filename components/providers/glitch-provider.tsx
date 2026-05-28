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
  /** Текущий режим эффекта, потребляется иконками стека (skill-icon). */
  mode: GlitchMode;
}

const GlitchContext = createContext<GlitchContextType>({ mode: "normal" });

export function useGlitch() {
  return useContext(GlitchContext);
}

export function GlitchProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<GlitchMode>("normal");

  // Авто-цикл normal → glitch → ascii → glitch → normal. Вложенные таймеры
  // чистим, чтобы не оставлять висящие setTimeout при размонтировании.
  useEffect(() => {
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    const interval = setInterval(() => {
      setMode("glitch");
      timeouts.push(setTimeout(() => setMode("ascii"), 300));
      timeouts.push(setTimeout(() => setMode("glitch"), 3000));
      timeouts.push(setTimeout(() => setMode("normal"), 3300));
    }, 8000);

    return () => {
      clearInterval(interval);
      timeouts.forEach(clearTimeout);
    };
  }, []);

  return (
    <GlitchContext.Provider value={{ mode }}>{children}</GlitchContext.Provider>
  );
}
