"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, AsciiRenderer } from "@react-three/drei";
import { EffectComposer, Glitch } from "@react-three/postprocessing";
import { GlitchMode } from "postprocessing";
import { Vector2 } from "three";
import { Model } from "../../model/Chibi1";
import { useGlitch } from "@/components/providers/glitch-provider";
import { useTheme } from "next-themes";

function SceneContent({
  isDark,
  canvasBg,
  purpleCore,
  mode,
  isMobile,
  onFpsUpdate,
  cameraFov,
}: {
  isDark: boolean;
  canvasBg: string;
  purpleCore: string;
  mode: string;
  isMobile: boolean;
  onFpsUpdate: (fps: number) => void;
  cameraFov: number;
}) {
  const controlsRef = useRef<any>(null);
  const modelRef = useRef<any>(null);
  const isDragging = useRef(false);
  const dragTimeoutRef = useRef<any>(null);

  const fpsFrames = useRef(0);
  const fpsLastTime = useRef(0);

  const handleInteractionEnd = () => {
    if (dragTimeoutRef.current) clearTimeout(dragTimeoutRef.current);
    dragTimeoutRef.current = setTimeout(() => {
      isDragging.current = false;
    }, 300);
  };

  useFrame((state) => {
    const currentCamera = state.camera as any;
    if (currentCamera.fov !== cameraFov) {
      currentCamera.fov = cameraFov;
      currentCamera.updateProjectionMatrix();
    }

    fpsFrames.current++;
    const currentTime = state.clock.getElapsedTime();
    if (currentTime - fpsLastTime.current >= 0.5) {
      const calculatedFps = Math.round(
        fpsFrames.current / (currentTime - fpsLastTime.current),
      );
      onFpsUpdate(calculatedFps);
      fpsFrames.current = 0;
      fpsLastTime.current = currentTime;
    }

    const t = state.clock.getElapsedTime();

    if (modelRef.current) {
      modelRef.current.rotation.y = 2.5 + Math.sin(t * 0.6) * 0.25;
    }

    if (!isDragging.current && controlsRef.current) {
      state.camera.position.x += (7.8 - state.camera.position.x) * 0.05;
      state.camera.position.y += (1.8 - state.camera.position.y) * 0.05;
      state.camera.position.z += (-4.8 - state.camera.position.z) * 0.05;

      controlsRef.current.target.x += (0 - controlsRef.current.target.x) * 0.05;
      controlsRef.current.target.y += (0 - controlsRef.current.target.y) * 0.05;
      controlsRef.current.target.z += (0 - controlsRef.current.target.z) * 0.05;

      controlsRef.current.update();
    }
  });

  useEffect(() => {
    return () => {
      if (dragTimeoutRef.current) clearTimeout(dragTimeoutRef.current);
    };
  }, []);

  return (
    <>
      <ambientLight intensity={isDark ? 1.2 : 1.5} />
      <directionalLight position={[10, 10, 10]} intensity={isDark ? 1 : 0.8} />
      <directionalLight
        position={[-10, 10, -10]}
        intensity={isDark ? 2.5 : 1.8}
        color={purpleCore}
      />
      <Environment preset="city" />

      <OrbitControls
        ref={controlsRef}
        enableZoom={true}
        autoRotate={false}
        enableDamping={true}
        dampingFactor={0.05}
        onStart={() => {
          if (dragTimeoutRef.current) clearTimeout(dragTimeoutRef.current);
          isDragging.current = true;
        }}
        onEnd={handleInteractionEnd}
      />

      <Suspense fallback={null}>
        <group ref={modelRef}>
          <Model position={[0, 0.2, 0]} scale={3} />
        </group>
      </Suspense>

      {mode === "glitch" && (
        <EffectComposer>
          <Glitch
            delay={new Vector2(0, 0)}
            duration={new Vector2(0.1, 0.3)}
            strength={isMobile ? new Vector2(0.1, 0.2) : new Vector2(0.2, 0.4)}
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
          resolution={isMobile ? 0.11 : 0.15}
        />
      )}
    </>
  );
}

export function AsciModelViewer() {
  const { mode } = useGlitch();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [realFps, setRealFps] = useState(60);
  const [cameraFov, setCameraFov] = useState(25);

  useEffect(() => {
    setMounted(true);

    const checkMetrics = () => {
      setIsMobile(window.innerWidth < 768);

      if (window.innerHeight < 550) {
        setCameraFov(17);
      } else if (window.innerWidth < 480) {
        setCameraFov(22);
      } else {
        setCameraFov(25);
      }
    };

    checkMetrics();
    window.addEventListener("resize", checkMetrics);

    const originalWarn = console.warn;
    console.warn = (...args) => {
      const message = args.join(" ");
      if (
        message.includes("THREE.Clock") ||
        message.includes("deprecated") ||
        message.includes("X4122") ||
        message.includes("double precision")
      ) {
        return;
      }
      originalWarn(...args);
    };

    return () => {
      console.warn = originalWarn;
      window.removeEventListener("resize", checkMetrics);
    };
  }, []);

  const isDark = !mounted || resolvedTheme === "dark";
  const canvasBg = isDark ? "#000000" : "#ffffff";
  const purpleCore = "#c084fc";
  const gridColor = isDark
    ? "rgba(168, 85, 247, 0.03)"
    : "rgba(168, 85, 247, 0.07)";

  return (
    <div className="relative h-80 sm:h-96 lg:h-full w-full font-mono transition-colors duration-300">
      <div
        className="absolute inset-0 border border-purple-400/20 flex items-center justify-center bg-zinc-50 dark:bg-black transition-colors duration-300"
        style={{
          backgroundImage: `
            linear-gradient(to right, ${gridColor} 1px, transparent 1px),
            linear-gradient(to bottom, ${gridColor} 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px",
        }}>
        <div className="absolute inset-0 z-10 touch-none">
          <Canvas
            camera={{ position: [7.8, 1.8, -4.8], fov: cameraFov }}
            dpr={isMobile ? [1, 1] : [1, 1.5]}>
            <color attach="background" args={[canvasBg]} />

            <SceneContent
              isDark={isDark}
              canvasBg={canvasBg}
              purpleCore={purpleCore}
              mode={mode}
              isMobile={isMobile}
              onFpsUpdate={setRealFps}
              cameraFov={cameraFov}
            />
          </Canvas>
        </div>
        <div className="absolute text-purple-500/40 dark:text-purple-400/30 text-xs z-20 select-none top-2 left-2">
          ┌──
        </div>
        <div className="absolute text-purple-500/40 dark:text-purple-400/30 text-xs z-20 select-none top-2 right-2">
          ──┐
        </div>
        <div className="absolute text-purple-500/40 dark:text-purple-400/30 text-xs z-20 select-none bottom-2 left-2">
          └──
        </div>
        <div className="absolute text-purple-500/40 dark:text-purple-400/30 text-xs z-20 select-none bottom-2 right-2">
          ──┘
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 border-t border-purple-500/20 dark:border-purple-400/20 bg-white/90 dark:bg-black/80 px-4 py-1.5 z-20 transition-colors duration-300">
        <div className="flex justify-between text-[11px] text-zinc-500 dark:text-zinc-400">
          <span className="text-purple-600 dark:text-purple-400 font-bold animate-pulse">
            ● RENDER:{" "}
            {mode === "ascii"
              ? "ASCII_MODE"
              : mode === "glitch"
                ? "GLITCHING"
                : "WEBGL_ACTIVE"}
          </span>
          <span>FPS: {realFps}</span>
          <span>CORE_V2</span>
        </div>
      </div>
    </div>
  );
}
