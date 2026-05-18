"use client";

interface Props {
  items: string[];
}

export function TechBadges({ items }: Props) {
  return (
    <div className="relative w-full min-h-[100px] border border-dashed border-[#888888]/30 bg-[#000000] p-2">
      <div className="text-[10px] text-[#888888] absolute top-1 right-1">
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        {items.map((tech) => (
          <span
            key={tech}
            className="bg-[#b026ff]/10 text-[#e0e0e0] border border-[#b026ff]/50 px-2 py-1 text-sm inline-block">
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
}
