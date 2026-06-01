import createNextIntlPlugin from "next-intl/plugin";
import { withPayload } from "@payloadcms/next/withPayload";

const withNextIntl = createNextIntlPlugin("./i18n.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Проверка типов при сборке включена: `tsc --noEmit` сейчас чист (0 ошибок).
  // Если Payload-генерация типов начнёт ломать билд — вернуть `typescript.ignoreBuildErrors`.
  images: {
    unoptimized: true,
  },
  // для дебага на телефоне
  // experimental: {
  //   allowedDevOrigins: ["*"],
  // },
  async rewrites() {
    return [
      {
        source: "/api/icons",
        destination: "https://skillicons.dev/icons",
      },
    ];
  },
};

// Композиция плагинов: сначала next-intl, затем Payload (порядок важен —
// см. docs/gotchas.md). Payload навешивает свои externals и транспайл.
export default withPayload(withNextIntl(nextConfig));
