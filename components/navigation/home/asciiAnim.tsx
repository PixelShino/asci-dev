"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  PIXELSHINO_LETTERS,
  LETTER_STAGGER_MS,
  GLITCH_INTERVAL_MS,
} from "./pixelshinoFrames";

const TOTAL = PIXELSHINO_LETTERS.length;
const LETTER_ROWS = 5;
const GAP_ROWS_EQUIV = 1.2; // визуальный gap между буквами в эквиваленте строк
const TOTAL_ROWS = TOTAL * LETTER_ROWS + (TOTAL - 1) * GAP_ROWS_EQUIV;
const MIN_FONT = 6;
const MAX_FONT = 22;

// SSR-safe — useEffect для серверного prerender, useLayoutEffect — для клиента.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function AsciiAnim() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [fontSize, setFontSize] = useState<number>(12);
  const [visible, setVisible] = useState(0);
  const [glitchIdx, setGlitchIdx] = useState<number | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mql.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  // Автофит: считаем font-size так, чтобы все буквы влезли в высоту контейнера.
  useIsomorphicLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const recalc = () => {
      const h = el.clientHeight;
      if (h <= 0) return;
      // leading == 1, поэтому высота 1 строки ≈ font-size.
      const target = Math.floor(h / TOTAL_ROWS);
      setFontSize(Math.max(MIN_FONT, Math.min(MAX_FONT, target)));
    };

    recalc();
    const ro = new ResizeObserver(recalc);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Stagger-печать букв при монтировании.
  useEffect(() => {
    if (!mounted) return;
    if (reducedMotion) {
      setVisible(TOTAL);
      return;
    }
    setVisible(0);
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (let i = 1; i <= TOTAL; i++) {
      timers.push(setTimeout(() => setVisible(i), i * LETTER_STAGGER_MS));
    }
    return () => timers.forEach(clearTimeout);
  }, [mounted, reducedMotion]);

  // Случайная буква мигает «глитчем» раз в GLITCH_INTERVAL_MS.
  useEffect(() => {
    if (!mounted || reducedMotion) return;
    let offTimer: ReturnType<typeof setTimeout> | undefined;
    const id = setInterval(() => {
      const next = Math.floor(Math.random() * TOTAL);
      setGlitchIdx(next);
      offTimer = setTimeout(() => setGlitchIdx(null), 140);
    }, GLITCH_INTERVAL_MS);
    return () => {
      clearInterval(id);
      if (offTimer) clearTimeout(offTimer);
    };
  }, [mounted, reducedMotion]);

  const gridColor = "rgba(168, 85, 247, 0.05)";

  return (
    <div
      className="relative h-80 sm:h-96 lg:h-[calc(100vh-220px)] lg:max-h-[680px] w-full font-mono overflow-hidden"
      role="img"
      aria-label="PIXELSHINO">
      <div
        className="absolute inset-0 border border-purple-400/20 bg-zinc-50 dark:bg-black transition-colors duration-300"
        style={{
          backgroundImage: `
            linear-gradient(to right, ${gridColor} 1px, transparent 1px),
            linear-gradient(to bottom, ${gridColor} 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px",
        }}>
        <span className="absolute top-2 left-2 text-purple-500/40 dark:text-purple-400/30 text-xs z-20 select-none">
          ┌──
        </span>
        <span className="absolute top-2 right-2 text-purple-500/40 dark:text-purple-400/30 text-xs z-20 select-none">
          ──┐
        </span>
        <span className="absolute bottom-2 left-2 text-purple-500/40 dark:text-purple-400/30 text-xs z-20 select-none">
          └──
        </span>
        <span className="absolute bottom-2 right-2 text-purple-500/40 dark:text-purple-400/30 text-xs z-20 select-none">
          ──┘
        </span>

        <div
          ref={containerRef}
          className="absolute inset-x-0 top-4 bottom-10 flex flex-col items-center justify-center gap-[0.6em] pixel-jitter z-10"
          style={{ fontSize: `${fontSize}px`, lineHeight: 1 }}
          aria-hidden="true">
          {PIXELSHINO_LETTERS.map((letter, i) => {
            const shown = i < visible;
            const isGlitching = glitchIdx === i;
            return (
              <pre
                key={i}
                className={`m-0 p-0 whitespace-pre select-none text-purple-600 dark:text-purple-400 drop-shadow-[0_0_6px_rgba(168,85,247,0.35)] transition-opacity duration-150 ${
                  shown ? (isGlitching ? "opacity-40" : "opacity-100") : "opacity-0"
                }`}
                style={
                  isGlitching
                    ? {
                        textShadow:
                          "2px 0 0 rgba(255,0,96,0.7), -2px 0 0 rgba(0,209,255,0.7)",
                      }
                    : undefined
                }>
                {letter}
              </pre>
            );
          })}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 border-t border-purple-500/20 dark:border-purple-400/20 bg-white/90 dark:bg-black/80 px-3 py-1.5 z-20 transition-colors duration-300">
        <div className="flex items-center justify-between gap-2 text-[11px] text-zinc-500 dark:text-zinc-400">
          <span className="text-purple-600 dark:text-purple-400 font-bold">
            ● ONLINE
          </span>
          <span className="hidden sm:inline tracking-widest">PIXELSHINO_V1</span>
          <span>CORE_V2</span>
        </div>
      </div>
    </div>
  );
}
