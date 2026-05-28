"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  PIXELSHINO_LETTERS,
  LETTER_ROWS,
  LETTER_COLS,
  GAP_ROWS,
  NOISE_CHARS,
  LETTER_STAGGER_MS,
  NOISE_TICK_MS,
} from "./pixelshinoFrames";

const TOTAL_LETTERS = PIXELSHINO_LETTERS.length;
const TOTAL_LETTER_ROWS =
  TOTAL_LETTERS * LETTER_ROWS + (TOTAL_LETTERS - 1) * GAP_ROWS;
const CHAR_WIDTH_RATIO = 0.62;
const MIN_FONT = 7;
const MAX_FONT = 28;
const STATIC_SEED = 1;
const HALO_RADIUS = 1;
const LETTER_GLYPHS = "#@*%&";

type Geometry = { fontSize: number; cols: number; rows: number };
type Layers = { noise: string; halo: string; letter: string };

const EMPTY_LAYERS: Layers = { noise: "", halo: "", letter: "" };

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function isLetterPixelAt(
  r: number,
  c: number,
  padTop: number,
  padLeft: number,
  visibleLetters: number,
): boolean {
  const localR = r - padTop;
  const localC = c - padLeft;
  if (localC < 0 || localC >= LETTER_COLS) return false;
  if (localR < 0 || localR >= TOTAL_LETTER_ROWS) return false;
  const blockH = LETTER_ROWS + GAP_ROWS;
  const letterIdx = Math.floor(localR / blockH);
  if (letterIdx >= TOTAL_LETTERS) return false;
  if (letterIdx >= visibleLetters) return false;
  const innerR = localR - letterIdx * blockH;
  if (innerR >= LETTER_ROWS) return false;
  return PIXELSHINO_LETTERS[letterIdx][innerR][localC] === "█";
}

/**
 * Возвращает 3 слоя отдельными строками: noise / halo / letter.
 * Это позволяет рендерить три простых `<pre>` вместо тысяч `<span>` с
 * разными классами. React диффит 3 текста на тик, не 3000 элементов.
 */
function buildLayers(
  seed: number,
  visibleLetters: number,
  geom: Geometry,
): Layers {
  const rng = mulberry32(seed);
  const padTop = Math.max(0, Math.floor((geom.rows - TOTAL_LETTER_ROWS) / 2));
  const padLeft = Math.max(0, Math.floor((geom.cols - LETTER_COLS) / 2));

  const isLetter = (r: number, c: number) =>
    isLetterPixelAt(r, c, padTop, padLeft, visibleLetters);

  const noise: string[] = [];
  const halo: string[] = [];
  const letter: string[] = [];

  for (let r = 0; r < geom.rows; r++) {
    let nLine = "";
    let hLine = "";
    let lLine = "";
    for (let c = 0; c < geom.cols; c++) {
      if (isLetter(r, c)) {
        lLine += LETTER_GLYPHS[Math.floor(rng() * LETTER_GLYPHS.length)];
        nLine += " ";
        hLine += " ";
        continue;
      }
      let inHalo = false;
      for (let dr = -HALO_RADIUS; dr <= HALO_RADIUS && !inHalo; dr++) {
        for (let dc = -HALO_RADIUS; dc <= HALO_RADIUS && !inHalo; dc++) {
          if (dr === 0 && dc === 0) continue;
          if (isLetter(r + dr, c + dc)) inHalo = true;
        }
      }
      const ch = NOISE_CHARS[Math.floor(rng() * NOISE_CHARS.length)];
      if (inHalo) {
        hLine += ch;
        nLine += " ";
      } else {
        nLine += ch;
        hLine += " ";
      }
      lLine += " ";
    }
    noise.push(nLine);
    halo.push(hLine);
    letter.push(lLine);
  }
  return {
    noise: noise.join("\n"),
    halo: halo.join("\n"),
    letter: letter.join("\n"),
  };
}

const LAYER_BASE = "absolute inset-0 m-0 p-0 whitespace-pre select-none";
const NOISE_CLASS = "text-purple-500/80 dark:text-purple-400";
const HALO_CLASS = "text-purple-500/40 dark:text-purple-300/40";
const LETTER_CLASS = "text-zinc-800 dark:text-zinc-200 font-bold";

export function AsciiAnim() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [geom, setGeom] = useState<Geometry>({
    fontSize: 12,
    cols: LETTER_COLS,
    rows: TOTAL_LETTER_ROWS,
  });
  const [seed, setSeed] = useState<number>(STATIC_SEED);
  const [visible, setVisible] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    setMounted(true);
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mql.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  useIsomorphicLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const recalc = () => {
      const h = el.clientHeight;
      const w = el.clientWidth;
      if (h <= 0 || w <= 0) return;
      const byHeight = h / TOTAL_LETTER_ROWS;
      const byWidth = w / (LETTER_COLS * CHAR_WIDTH_RATIO);
      const targetFont = Math.floor(Math.min(byHeight, byWidth));
      const fontSize = Math.max(MIN_FONT, Math.min(MAX_FONT, targetFont));
      const cols = Math.max(
        LETTER_COLS,
        Math.floor(w / (fontSize * CHAR_WIDTH_RATIO)),
      );
      const rows = Math.max(TOTAL_LETTER_ROWS, Math.floor(h / fontSize));
      setGeom({ fontSize, cols, rows });
    };
    recalc();
    const ro = new ResizeObserver(recalc);
    ro.observe(el);
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.some((e) => e.isIntersecting);
        setIsVisible(visible);
        if (visible) recalc();
      },
      { threshold: 0 },
    );
    io.observe(el);
    return () => {
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (reducedMotion) {
      setVisible(TOTAL_LETTERS);
      return;
    }
    setVisible(0);
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (let i = 1; i <= TOTAL_LETTERS; i++) {
      timers.push(setTimeout(() => setVisible(i), i * LETTER_STAGGER_MS));
    }
    return () => timers.forEach(clearTimeout);
  }, [mounted, reducedMotion]);

  useEffect(() => {
    if (!mounted || reducedMotion || !isVisible) return;
    const id = setInterval(() => setSeed((s) => (s + 1) >>> 0), NOISE_TICK_MS);
    return () => clearInterval(id);
  }, [mounted, reducedMotion, isVisible]);

  const layers = useMemo(
    () =>
      isVisible
        ? buildLayers(
            reducedMotion ? STATIC_SEED : seed,
            reducedMotion ? TOTAL_LETTERS : visible,
            geom,
          )
        : EMPTY_LAYERS,
    [seed, visible, reducedMotion, geom, isVisible],
  );

  const gridColor = "rgba(168, 85, 247, 0.05)";
  const preStyle = { fontSize: `${geom.fontSize}px`, lineHeight: 1 };

  return (
    <div
      className="relative h-full w-full font-mono overflow-hidden"
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
        <span className="hidden sm:inline absolute top-2 left-2 text-purple-500/40 dark:text-purple-400/30 text-xs z-20 select-none">
          ┌──
        </span>
        <span className="hidden sm:inline absolute top-2 right-2 text-purple-500/40 dark:text-purple-400/30 text-xs z-20 select-none">
          ──┐
        </span>
        <span className="hidden sm:inline absolute bottom-2 left-2 text-purple-500/40 dark:text-purple-400/30 text-xs z-20 select-none">
          └──
        </span>
        <span className="hidden sm:inline absolute bottom-2 right-2 text-purple-500/40 dark:text-purple-400/30 text-xs z-20 select-none">
          ──┘
        </span>

        <div
          ref={containerRef}
          className="absolute inset-x-0 top-4 bottom-10 pixel-jitter z-10"
          aria-hidden="true">
          <div className="relative w-full h-full flex items-center justify-center">
            <div
              className="relative"
              style={{
                width: `${geom.cols * geom.fontSize * CHAR_WIDTH_RATIO}px`,
                height: `${geom.rows * geom.fontSize}px`,
              }}>
              <pre className={`${LAYER_BASE} ${NOISE_CLASS}`} style={preStyle}>
                {layers.noise}
              </pre>
              <pre className={`${LAYER_BASE} ${HALO_CLASS}`} style={preStyle}>
                {layers.halo}
              </pre>
              <pre className={`${LAYER_BASE} ${LETTER_CLASS}`} style={preStyle}>
                {layers.letter}
              </pre>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 border-t border-purple-500/20 dark:border-purple-400/20 bg-white/90 dark:bg-black/80 px-3 py-1.5 z-20 transition-colors duration-300">
        <div className="flex items-center justify-between gap-2 text-[11px] text-zinc-500 dark:text-zinc-400">
          <span className="text-purple-600 dark:text-purple-400 font-bold">
            ● ONLINE
          </span>
          <span className="hidden sm:inline tracking-widest">PIXELSHINO_V1</span>
          <span className="tabular-nums">{`${geom.cols}×${geom.rows}`}</span>
        </div>
      </div>
    </div>
  );
}
