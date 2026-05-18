"use client";

import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

export function ParticlesProvider() {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  if (!init) return null;

  return (
    <Particles
      id="tsparticles"
      className="fixed inset-0 -z-50 pointer-events-none"
      options={{
        background: {
          color: { value: "transparent" },
        },
        fpsLimit: 60,
        particles: {
          color: { value: "#b026ff" },
          links: {
            color: "#b026ff",
            distance: 120,
            enable: true,
            opacity: 0.15,
            width: 1,
          },
          move: {
            enable: true,
            direction: "none",
            outModes: { default: "bounce" },
            random: true,
            speed: 0.4,
            straight: false,
          },
          number: {
            density: { enable: true, width: 800, height: 800 },
            value: 60,
          },
          opacity: { value: 1 },
          shape: { type: "circle" },
          size: { value: { min: 0.5, max: 1.5 } },
        },
        detectRetina: true,
      }}
    />
  );
}
