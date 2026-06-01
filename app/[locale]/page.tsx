import PortfolioClient from "@/components/tabs";
import { setRequestLocale } from "next-intl/server";
import { getPayloadClient } from "@/lib/payload";
import type { Project } from "@/components/navigation/projects/layout";
import type { Project as PayloadProject, Media } from "@/payload-types";

interface Props {
  params: Promise<{ locale: string }>;
}

// Картинки проекта: галерея-upload (новые) либо legacy-папка public/projects.
function projectImages(p: PayloadProject): string[] {
  const fromGallery = (p.gallery ?? [])
    .map((g) =>
      typeof g.image === "object" && g.image ? (g.image as Media).url : null,
    )
    .filter((url): url is string => Boolean(url));
  if (fromGallery.length) return fromGallery;

  if (p.legacyFolder && p.legacyImageCount) {
    return Array.from({ length: p.legacyImageCount }).map((_, i) => {
      // У rulme-client отсутствует файл 2.webp — сохраняем исходный сдвиг.
      const fileIndex = p.slug === "rulme-client" && i >= 2 ? i + 1 : i;
      return `/projects/${p.legacyFolder}/${fileIndex}.webp`;
    });
  }
  return [];
}

function mapProject(p: PayloadProject): Project {
  return {
    id: p.id,
    slug: p.slug,
    title: p.title ?? "",
    shortDesc: p.shortDesc ?? "",
    fullDesc: p.fullDesc ?? "",
    features: (p.features ?? [])
      .map((f) => f.text)
      .filter((t): t is string => Boolean(t)),
    techStack: p.techStack ?? [],
    githubUrl: p.githubUrl || undefined,
    images: projectImages(p),
  };
}

export default async function Page(props: Props) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: "projects",
    locale: locale as "en" | "ru",
    sort: "order",
    depth: 1,
    limit: 100,
    overrideAccess: true,
  });

  const projects = docs.map(mapProject);

  return <PortfolioClient projects={projects} />;
}
