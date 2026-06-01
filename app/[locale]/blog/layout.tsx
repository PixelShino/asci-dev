import { setRequestLocale } from "next-intl/server";
import { BlogShell } from "@/components/navigation/blog/blogShell";

interface Props {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

// Оболочка персистит между списком и постом — `loading.tsx` подменяет только
// внутренний контент, навигация/хедер/футер не моргают.
export default async function BlogLayout({ children, params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <BlogShell>{children}</BlogShell>;
}
