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
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|glb|gltf)$).*)",
  ],
};
