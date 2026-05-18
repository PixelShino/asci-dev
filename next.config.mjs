import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
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
