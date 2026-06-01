import { Skeleton } from "@/components/ui/skeleton";

// Скелетон списка — рендерится внутри персистентной оболочки блога.
export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="space-y-2 border-b border-purple-400/20 pb-4">
        <Skeleton className="h-7 w-44 rounded-sm" />
        <Skeleton className="h-4 w-72 rounded-sm" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-sm border border-purple-400/15">
            <Skeleton className="aspect-[16/9] w-full rounded-none" />
            <div className="space-y-3 p-5">
              <Skeleton className="h-3 w-24 rounded-sm" />
              <Skeleton className="h-5 w-3/4 rounded-sm" />
              <Skeleton className="h-4 w-full rounded-sm" />
              <Skeleton className="h-4 w-2/3 rounded-sm" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
