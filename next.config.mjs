import createNextIntlPlugin from "next-intl/plugin";

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

export default withNextIntl(nextConfig);
