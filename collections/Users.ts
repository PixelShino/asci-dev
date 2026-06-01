import type { CollectionConfig } from "payload";

// Администраторы CMS. Встроенная авторизация Payload (без Better Auth).
export const Users: CollectionConfig = {
  slug: "users",
  admin: {
    useAsTitle: "email",
    group: "Система",
  },
  auth: true,
  fields: [
    {
      name: "name",
      type: "text",
      label: "Имя",
    },
  ],
};
