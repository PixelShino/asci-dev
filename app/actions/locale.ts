"use server";

import { cookies } from "next/headers";

export async function setLocale(locale: "en" | "ru") {
  const cookieStore = await cookies();
  cookieStore.set("NEXT_LOCALE", locale, { path: "/" });
}
