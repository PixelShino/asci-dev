import type { Metadata, Viewport } from "next";
import { JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "../globals.css";
import { GlitchProvider } from "@/components/providers/glitch-provider";
import { ParticlesProvider } from "@/components/providers/particles-provider";
import { getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "DMITRII-GOLDOBIN.SYS",
  description: "Full-Stack Developer Portfolio - Terminal Interface",
  icons: {
    icon: [
      { url: "/icon-light-32x32.png", media: "(prefers-color-scheme: light)" },
      { url: "/icon-dark-32x32.png", media: "(prefers-color-scheme: dark)" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale} className="dark">
      <body
        className={`${jetbrainsMono.variable} font-mono antialiased bg-[#000000] text-[#e0e0e0]`}>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <GlitchProvider>
            <ParticlesProvider />
            {children}
          </GlitchProvider>
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
