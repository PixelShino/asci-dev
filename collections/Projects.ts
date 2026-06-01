import type { CollectionConfig } from "payload";

// Проекты портфолио. Раньше были захардкожены массивом + переводами JSON
// (с хрупким featureCount). Теперь — управляемая коллекция: тексты/фичи/стек/
// порядок правятся из админки. Картинки: либо галерея-upload (новые проекты),
// либо legacy-папка в `public/projects/<folder>` (существующие, без перезаливки).
export const Projects: CollectionConfig = {
  slug: "projects",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "order", "updatedAt"],
    group: "Контент",
  },
  defaultSort: "order",
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "title",
      type: "text",
      label: "Название",
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
        description: "ID проекта (латиница, без пробелов).",
      },
    },
    {
      name: "order",
      type: "number",
      label: "Порядок",
      defaultValue: 0,
      admin: { position: "sidebar" },
    },
    {
      name: "shortDesc",
      type: "textarea",
      label: "Краткое описание",
      localized: true,
    },
    {
      name: "fullDesc",
      type: "textarea",
      label: "Полное описание",
      localized: true,
    },
    {
      name: "features",
      type: "array",
      label: "Ключевые решения",
      localized: true,
      fields: [{ name: "text", type: "textarea", required: true }],
    },
    {
      name: "techStack",
      type: "text",
      label: "Технологический стек",
      hasMany: true,
    },
    {
      name: "githubUrl",
      type: "text",
      label: "GitHub (если репозиторий публичный)",
    },
    {
      name: "gallery",
      type: "array",
      label: "Галерея (для новых проектов)",
      fields: [
        { name: "image", type: "upload", relationTo: "media", required: true },
      ],
    },
    {
      name: "legacyFolder",
      type: "text",
      label: "Legacy-папка картинок",
      admin: {
        position: "sidebar",
        description: "Существующие проекты: public/projects/<папка>.",
      },
    },
    {
      name: "legacyImageCount",
      type: "number",
      label: "Кол-во legacy-картинок",
      admin: { position: "sidebar" },
    },
  ],
};
