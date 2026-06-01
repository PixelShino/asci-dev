import type { CollectionConfig } from "payload";

// Медиа-библиотека (обложки постов и пр.). Файлы — в Vercel Blob.
export const Media: CollectionConfig = {
  slug: "media",
  admin: { group: "Контент" },
  access: {
    read: () => true,
  },
  upload: true,
  fields: [
    {
      name: "alt",
      type: "text",
      label: "Alt-текст",
      localized: true,
    },
  ],
};
