import type { CollectionConfig } from "payload";

// Посты блога: rich-text, обложка, категория, SEO, черновик/публикация, ru/en.
export const Posts: CollectionConfig = {
  slug: "posts",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "_status", "updatedAt"],
    group: "Контент",
  },
  access: {
    // Публично видны только опубликованные; авторизованным — все (черновики).
    read: ({ req: { user } }) => {
      if (user) return true;
      return { _status: { equals: "published" } };
    },
  },
  versions: {
    drafts: true,
    maxPerDoc: 50,
  },
  fields: [
    {
      name: "title",
      type: "text",
      label: "Заголовок",
      required: true,
      localized: true,
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
      admin: {
        position: "sidebar",
        description: "URL-идентификатор (латиница, без пробелов).",
      },
    },
    {
      name: "excerpt",
      type: "textarea",
      label: "Краткое описание",
      localized: true,
    },
    {
      name: "coverImage",
      type: "upload",
      relationTo: "media",
      label: "Обложка",
    },
    {
      name: "category",
      type: "relationship",
      relationTo: "categories",
      label: "Категория",
    },
    {
      name: "content",
      type: "richText",
      label: "Содержимое",
      localized: true,
    },
    {
      name: "publishedAt",
      type: "date",
      label: "Дата публикации",
      admin: {
        position: "sidebar",
        date: { pickerAppearance: "dayAndTime" },
      },
    },
    {
      type: "group",
      name: "seo",
      label: "SEO",
      fields: [
        {
          name: "metaTitle",
          type: "text",
          label: "Meta Title",
          localized: true,
        },
        {
          name: "metaDescription",
          type: "textarea",
          label: "Meta Description",
          localized: true,
        },
      ],
    },
  ],
};
