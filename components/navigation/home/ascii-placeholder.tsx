"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, AsciiRenderer } from "@react-three/drei";
import { EffectComposer, Glitch } from "@react-three/postprocessing";
import { GlitchMode } from "postprocessing";
import { Model } from "../../model/Chibi1";
import { Suspense } from "react";
import { useGlitch } from "@/components/providers/glitch-provider";

export function AsciModelViewer() {
  const { mode } = useGlitch();

  return (
    <div className="relative h-full min-h-100 lg:min-h-125">
      <div
        className="
          absolute inset-0
          border-2 border-dashed border-[#b026ff]/40
          flex items-center justify-center
          bg-[#000000]
        "
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(176, 38, 255, 0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(176, 38, 255, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px",
        }}>
        <div className="absolute inset-0 z-10">
          <Canvas camera={{ position: [8, 2, -5], fov: 27 }}>
            <color attach="background" args={["#000000"]} />

            <ambientLight intensity={1.2} />

            <directionalLight position={[10, 10, 10]} intensity={1} />

            <directionalLight
              position={[-10, 10, -10]}
              intensity={2.5}
              color="#b026ff"
            />

            <Environment preset="city" />

            <OrbitControls enableZoom={true} autoRotate autoRotateSpeed={0.5} />

            <Suspense fallback={null}>
              <Model position={[0, -0.2, 0]} scale={4} />
            </Suspense>

            {mode === "glitch" && (
              <EffectComposer>
                <Glitch
                  delay={[0, 0]}
                  duration={[0.1, 0.3]}
                  strength={[0.2, 0.4]}
                  mode={GlitchMode.SPORADIC}
                  active
                />
              </EffectComposer>
            )}

            {mode === "ascii" && (
              <AsciiRenderer
                fgColor="#b026ff"
                bgColor="#000000"
                characters=" .:-+*=%@#"
                invert={false}
                resolution={0.15}
              />
            )}
          </Canvas>
        </div>

        <div className="absolute top-2 left-2 text-[#b026ff]/50 text-xs z-20">
          ┌──
        </div>
        <div className="absolute top-2 right-2 text-[#b026ff]/50 text-xs z-20">
          ──┐
        </div>
        <div className="absolute bottom-2 left-2 text-[#b026ff]/50 text-xs z-20">
          └──
        </div>
        <div className="absolute bottom-2 right-2 text-[#b026ff]/50 text-xs z-20">
          ──┘
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 border-t border-[#b026ff]/20 bg-[#000000]/80 px-4 py-2 z-20">
        <div className="flex justify-between text-xs text-[#888888]">
          <span className="text-[#b026ff]">
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
