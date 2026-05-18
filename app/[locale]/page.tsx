import PortfolioClient from "@/components/portfolio-client";
import { setRequestLocale } from "next-intl/server";

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function Page(props: Props) {
  const { locale } = await props.params;

  setRequestLocale(locale);

  return <PortfolioClient />;
}
