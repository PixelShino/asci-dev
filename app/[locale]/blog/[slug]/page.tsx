import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { getPayloadClient } from "@/lib/payload";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

async function fetchPost(locale: string, slug: string) {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: "posts",
    locale: locale as "en" | "ru",
    where: {
      and: [{ slug: { equals: slug } }, { _status: { equals: "published" } }],
    },
    depth: 2,
    limit: 1,
    overrideAccess: true,
  });
  return docs[0] ?? null;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { locale, slug } = await props.params;
  const post = await fetchPost(locale, slug);
  if (!post) return {};

  const title = post.seo?.metaTitle || post.title;
  const description = post.seo?.metaDescription || post.excerpt || undefined;
  const cover =
    typeof post.coverImage === "object" && post.coverImage
      ? post.coverImage
      : null;

  return {
    title: `${title} — DMITRII-GOLDOBIN`,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: post.publishedAt ?? undefined,
      images: cover?.url ? [{ url: cover.url }] : undefined,
    },
  };
}

export default async function PostPage(props: Props) {
  const { locale, slug } = await props.params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "Blog" });
  const post = await fetchPost(locale, slug);
  if (!post) notFound();

  const cover =
    typeof post.coverImage === "object" && post.coverImage
      ? post.coverImage
      : null;
  const category =
    typeof post.category === "object" && post.category
      ? post.category.title
      : undefined;
  const date = post.publishedAt ?? post.createdAt;
  const fmt = new Intl.DateTimeFormat(locale === "ru" ? "ru-RU" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article className="mx-auto max-w-3xl space-y-6 animate-fadeIn">
      <Link
        href={locale === "ru" ? "/ru/blog" : "/blog"}
        className="inline-block text-xs uppercase tracking-widest text-zinc-400 transition-colors hover:text-purple-500 dark:hover:text-purple-400">
        {"[ ← "}
        {t("back")}
        {" ]"}
      </Link>

      <header className="space-y-3 border-b border-purple-400/20 pb-5">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
          {date && <span>{fmt.format(new Date(date))}</span>}
          {category && (
            <>
              <span className="text-purple-400/50">/</span>
              <span className="text-purple-500 dark:text-purple-400">
                {category}
              </span>
            </>
          )}
        </div>
        <h1 className="text-2xl font-bold leading-tight sm:text-3xl">
          <span className="text-purple-500 dark:text-purple-400">{"// "}</span>
          {post.title}
        </h1>
        {post.excerpt && (
          <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
            {post.excerpt}
          </p>
        )}
      </header>

      {cover?.url && (
        // eslint-disable-next-line @next/next/no-img-element
        <div className="overflow-hidden rounded-sm border border-purple-400/15">
          <img
            src={cover.url}
            alt={cover.alt ?? post.title}
            className="w-full object-cover"
          />
        </div>
      )}

      {post.content && (
        <div className="blog-prose text-sm leading-relaxed text-zinc-700 dark:text-zinc-300 sm:text-[15px]">
          <RichText data={post.content} />
        </div>
      )}
    </article>
  );
}
