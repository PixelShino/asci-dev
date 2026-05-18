"use client";

import { useState, useEffect, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, AsciiRenderer } from "@react-three/drei";
import { EffectComposer, Glitch } from "@react-three/postprocessing";
import { GlitchMode } from "postprocessing";
import { Vector2 } from "three";
import { Model } from "../../model/Chibi1";
import { useGlitch } from "@/components/providers/glitch-provider";
import { useTheme } from "next-themes";

const STYLES = {
  container:
    "relative h-full min-h-100 lg:min-h-125 transition-colors duration-300",
  innerBounds:
    "absolute inset-0 border-2 border-dashed border-purple-500/30 dark:border-purple-400/20 flex items-center justify-center bg-zinc-50 dark:bg-black transition-colors duration-300",
  corners:
    "absolute text-purple-500/40 dark:text-purple-400/30 text-xs z-20 select-none",
  statusPanel:
    "absolute bottom-0 left-0 right-0 border-t border-purple-500/20 dark:border-purple-400/20 bg-white/90 dark:bg-black/80 px-4 py-2 z-20 font-mono transition-colors duration-300",
  statusText: "flex justify-between text-xs text-zinc-500 dark:text-zinc-400",
};

export function AsciModelViewer() {
  const { mode } = useGlitch();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = !mounted || resolvedTheme === "dark";
  const canvasBg = isDark ? "#000000" : "#ffffff";
  const purpleCore = "#c084fc";

  const gridColor = isDark
    ? "rgba(168, 85, 247, 0.03)"
    : "rgba(168, 85, 247, 0.07)";

  return (
    <div className={STYLES.container}>
      <div
        className={STYLES.innerBounds}
        style={{
          backgroundImage: `
            linear-gradient(to right, ${gridColor} 1px, transparent 1px),
            linear-gradient(to bottom, ${gridColor} 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px",
        }}>
        <div className="absolute inset-0 z-10">
          <Canvas camera={{ position: [8, 2, -5], fov: 27 }}>
            <color attach="background" args={[canvasBg]} />

            <ambientLight intensity={isDark ? 1.2 : 1.5} />
            <directionalLight
              position={[10, 10, 10]}
              intensity={isDark ? 1 : 0.8}
            />

            <directionalLight
              position={[-10, 10, -10]}
              intensity={isDark ? 2.5 : 1.8}
              color={purpleCore}
            />

            <Environment preset="city" />
            <OrbitControls enableZoom={true} autoRotate autoRotateSpeed={0.5} />

            <Suspense fallback={null}>
              <Model position={[0, -0.2, 0]} scale={4} />
            </Suspense>

            {mode === "glitch" && (
              <EffectComposer>
                <Glitch
                  delay={new Vector2(0, 0)}
                  duration={new Vector2(0.1, 0.3)}
                  strength={new Vector2(0.2, 0.4)}
                  mode={GlitchMode.SPORADIC}
                  active
                />
              </EffectComposer>
            )}

            {mode === "ascii" && (
              <AsciiRenderer
                fgColor={purpleCore}
                bgColor={canvasBg}
                characters=" .:-+*=%@#"
                invert={false}
                resolution={0.15}
              />
            )}
          </Canvas>
        </div>

        <div className={`${STYLES.corners} top-2 left-2`}>┌──</div>
        <div className={`${STYLES.corners} top-2 right-2`}>──┐</div>
        <div className={`${STYLES.corners} bottom-2 left-2`}>└──</div>
        <div className={`${STYLES.corners} bottom-2 right-2`}>──┘</div>
      </div>

      <div className={STYLES.statusPanel}>
        <div className={STYLES.statusText}>
          <span className="text-purple-600 dark:text-purple-400 font-bold">
            RENDER:{" "}
            {mode === "ascii"
              ? "ASCII_MODE"
              : mode === "glitch"
                ? "GLITCHING"
                : "WEBGL_ACTIVE"}
          </span>
          <span>FPS: 60</span>
          <span>WEBGL2</span>
        </div>
      </div>
    </div>
  );
}
