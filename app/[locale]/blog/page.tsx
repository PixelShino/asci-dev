import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getPayloadClient } from "@/lib/payload";
import { PostCard } from "@/components/navigation/blog/postCard";

// Список тянет данные из Neon через Payload — не пререндерим на билде.
export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "Blog" });
  return {
    title: `${t("title")} — DMITRII-GOLDOBIN`,
    description: t("meta_description"),
    alternates: { languages: { en: "/blog", ru: "/ru/blog" } },
  };
}

export default async function BlogPage(props: Props) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "Blog" });
  const payload = await getPayloadClient();

  const { docs } = await payload.find({
    collection: "posts",
    locale: locale as "en" | "ru",
    where: { _status: { equals: "published" } },
    sort: "-publishedAt",
    depth: 1,
    limit: 50,
    overrideAccess: true,
  });

  const fmt = new Intl.DateTimeFormat(locale === "ru" ? "ru-RU" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const blogBase = locale === "ru" ? "/ru/blog" : "/blog";

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="border-b border-purple-400/20 pb-4">
        <h1 className="text-xl sm:text-2xl font-bold tracking-wider">
          <span className="text-purple-500 dark:text-purple-400">{"// "}</span>
          {t("title")}
        </h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          {t("intro")}
        </p>
      </div>

      {docs.length === 0 ? (
        <div className="rounded-sm border border-dashed border-purple-400/25 p-10 text-center text-sm text-zinc-500 dark:text-zinc-400">
          {t("empty")}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {docs.map((post) => {
            const cover =
              typeof post.coverImage === "object" && post.coverImage
                ? post.coverImage
                : null;
            const category =
              typeof post.category === "object" && post.category
                ? post.category.title
                : undefined;
            const date = post.publishedAt ?? post.createdAt;
            return (
              <PostCard
                key={post.id}
                href={`${blogBase}/${post.slug}`}
                title={post.title}
                excerpt={post.excerpt ?? undefined}
                dateLabel={date ? fmt.format(new Date(date)) : undefined}
                category={category}
                coverUrl={cover?.url ?? undefined}
                coverAlt={cover?.alt ?? post.title}
                readMoreLabel={t("read_more")}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
