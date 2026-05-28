import createMiddleware from "next-intl/middleware";
import { NextRequest } from "next/server";

const intlProxy = createMiddleware({
  locales: ["en", "ru"],
  defaultLocale: "en",
  localePrefix: "as-needed",
});

export function proxy(req: NextRequest) {
  return intlProxy(req);
}

export const config = {
  matcher: [
    // Локализуем все маршруты, КРОМЕ служебных и любых файлов с расширением
    // (статика: .ico, .png, .webmanifest, .glb, .xml, ... — точка в пути).
    // Прежний allowlist расширений пропускал .webmanifest и .ico → давал 404.
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};
