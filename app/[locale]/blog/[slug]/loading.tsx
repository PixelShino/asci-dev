import { Skeleton } from "@/components/ui/skeleton";

// Скелетон страницы поста — внутри персистентной оболочки блога.
export default function Loading() {
  return (
    <article className="mx-auto max-w-3xl space-y-6">
      <Skeleton className="h-4 w-28 rounded-sm" />
      <div className="space-y-3 border-b border-purple-400/20 pb-5">
        <Skeleton className="h-3 w-32 rounded-sm" />
        <Skeleton className="h-8 w-3/4 rounded-sm" />
        <Skeleton className="h-4 w-full rounded-sm" />
      </div>
      <Skeleton className="aspect-[16/9] w-full rounded-sm" />
      <div className="space-y-3">
        <Skeleton className="h-4 w-full rounded-sm" />
        <Skeleton className="h-4 w-11/12 rounded-sm" />
        <Skeleton className="h-4 w-full rounded-sm" />
        <Skeleton className="h-4 w-2/3 rounded-sm" />
      </div>
    </article>
  );
}
