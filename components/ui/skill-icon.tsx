"use client";

import { useEffect, useState } from "react";
import { useGlitch } from "@/components/providers/glitch-provider";
import { AsciiImage } from "./ascii-image";

interface Props {
  id: string;
  label: string;
  size?: number;
  customImage?: string;
  textOnly?: boolean; // Добавили новый необязательный проп
}

export function SkillIcon({
  id,
  label,
  size = 42,
  customImage,
  textOnly = false,
}: Props) {
  const iconUrl = customImage || `/api/icons?i=${id}&theme=dark`;

  const [hasError, setHasError] = useState(false);
  const { mode: globalMode } = useGlitch();
  const [isActiveInCurrentCycle, setIsActiveInCurrentCycle] = useState(false);

  useEffect(() => {
    if (globalMode === "glitch") {
      setIsActiveInCurrentCycle(Math.random() > 0.7);
    } else if (globalMode === "normal") {
      setIsActiveInCurrentCycle(false);
    }
  }, [globalMode]);

  const currentMode = isActiveInCurrentCycle ? globalMode : "normal";

  // Стилизованный текстовый fallback (сделали его рамку чуть тоньше и аккуратнее под дизайн сетки)
  const TextFallback = () => (
    <div
      style={{ width: size, height: size }}
      className="flex items-center justify-center border border-purple-500/40 bg-purple-500/10 text-purple-600 dark:text-purple-400 font-mono text-[9px] font-extrabold uppercase overflow-hidden tracking-tighter select-none rounded-xs shadow-[0_0_8px_rgba(168,85,247,0.05)]">
      {label.substring(0, 3)}
    </div>
  );

  const renderIcon = (
    className: string = "",
    handleErrors: boolean = false,
  ) => {
    // ИСПРАВЛЕНО: Если включен режим textOnly или упала ошибка сети, сразу рендерим текст
    if (textOnly || hasError) return <TextFallback />;

    return (
      <img
        src={iconUrl}
        alt={label}
        width={size}
        height={size}
        onError={handleErrors ? () => setHasError(true) : undefined}
        className={className}
      />
    );
  };

  return (
    <div className="group relative flex flex-col items-center justify-center w-12.5 aspect-square">
      {/* Верхний всплывающий терминальный тултип */}
      <div className="absolute -top-10 scale-0 group-hover:scale-100 transition-all duration-150 z-50 pointer-events-none origin-bottom">
        <div className="bg-[#000000] border border-[#b026ff] px-2 py-1 shadow-[0_0_10px_rgba(176,38,255,0.3)]">
          <p className="text-[10px] text-[#b026ff] whitespace-nowrap font-mono uppercase tracking-wider">
            {"> "}SRC: {label}{" "}
            {textOnly ? "(RAW_TEXT)" : customImage ? "(LOCAL)" : "(NET_NODE)"}
          </p>
        </div>
      </div>

      <div className="relative p-1 border border-transparent group-hover:border-[#b026ff]/30 transition-all cursor-help flex items-center justify-center rounded-sm">
        {currentMode === "normal" &&
          renderIcon(
            "contrast-125 brightness-110 transition-all duration-300",
            true,
          )}

        {currentMode === "glitch" && (
          <div className="relative" style={{ width: size, height: size }}>
            {textOnly || hasError ? (
              <TextFallback />
            ) : (
              <>
                {renderIcon("absolute inset-0 opacity-50", true)}
                {renderIcon(
                  "absolute inset-0 glitch-layer-red mix-blend-screen",
                  false,
                )}
                {renderIcon(
                  "absolute inset-0 glitch-layer-blue mix-blend-screen",
                  false,
                )}
              </>
            )}
          </div>
        )}

        {currentMode === "ascii" &&
          (textOnly || hasError ? (
            <TextFallback />
          ) : (
            <AsciiImage
              src={iconUrl}
              className="text-[#b026ff] neon-glow font-bold animate-in fade-in duration-75"
              width={48}
            />
          ))}
      </div>
    </div>
  );
}
