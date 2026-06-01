import type { CollectionConfig } from "payload";

// Заявки с контактной формы (B2B-лиды). Раньше жили в Prisma — теперь в Payload,
// чтобы смотреть и вести их прямо в админке. Публичная запись идёт через
// `/api/contact` (Local API с overrideAccess), поэтому create закрыт для REST.
const authed = ({ req: { user } }: { req: { user?: unknown } }) => Boolean(user);

export const Leads: CollectionConfig = {
  slug: "leads",
  admin: {
    useAsTitle: "fullName",
    defaultColumns: ["fullName", "company", "status", "createdAt"],
    group: "Заявки",
  },
  access: {
    read: authed,
    create: authed,
    update: authed,
    delete: authed,
  },
  fields: [
    { name: "fullName", type: "text", label: "ФИО", required: true },
    { name: "phone", type: "text", label: "Телефон", required: true },
    { name: "company", type: "text", label: "Компания" },
    { name: "email", type: "email", label: "Email", required: true },
    { name: "message", type: "textarea", label: "Сообщение", required: true },
    {
      name: "status",
      type: "select",
      label: "Статус",
      defaultValue: "new",
      options: [
        { label: "Новая", value: "new" },
        { label: "В работе", value: "contacted" },
        { label: "Квалифицирована", value: "qualified" },
        { label: "Архив", value: "archived" },
      ],
      admin: { position: "sidebar" },
    },
  ],
};
