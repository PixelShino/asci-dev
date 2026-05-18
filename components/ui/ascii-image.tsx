"use client";

import { useEffect, useRef, useState } from "react";

const CHAR_MAP = " .:-=+*#%@";

function imageToAscii(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
): string {
  if (!canvas || !ctx) return "";

  const imgData = ctx.getImageData(0, 0, width, height).data;
  let asciiArt = "";

  for (let y = 0; y < height; y += 4) {
    for (let x = 0; x < width; x += 2) {
      const offset = (y * width + x) * 4;
      const r = imgData[offset];
      const g = imgData[offset + 1];
      const b = imgData[offset + 2];
      const a = imgData[offset + 3];

      if (a < 128) {
        asciiArt += " ";
        continue;
      }

      const luminosity = (r * 0.299 + g * 0.587 + b * 0.114) / 255;

      const charIndex = Math.floor(luminosity * (CHAR_MAP.length - 1));
      asciiArt += CHAR_MAP[charIndex];
    }
    asciiArt += "\n";
  }

  return asciiArt;
}

interface AsciiImageProps {
  src: string;
  className?: string;
  width?: number;
}

export function AsciiImage({ src, className, width = 64 }: AsciiImageProps) {
  const [ascii, setAscii] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = src;

    img.onload = () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d", { willReadFrequently: true });
      if (!canvas || !ctx) return;

      const scaleFactor = width / img.width;
      const h = Math.floor(img.height * scaleFactor);

      canvas.width = width;
      canvas.height = h;

      ctx.drawImage(img, 0, 0, width, h);

      const asciiArt = imageToAscii(canvas, ctx, width, h);
      setAscii(asciiArt);
    };

    img.onerror = () => {
      setAscii("ERR");
    };
  }, [src, width]);

  return (
    <>
      <canvas ref={canvasRef} className="hidden" />
      <pre
        className={`font-mono text-[6px] leading-[4px] tracking-[1px] whitespace-pre select-none ${className}`}>
        {ascii || "..."}
      </pre>
    </>
  );
}
