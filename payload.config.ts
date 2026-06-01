// Конфиг Payload CMS: контент/блог + медиа + вход в админку.
// Таблицы живут в отдельной Postgres-схеме `payload` (Prisma владеет `public`).
// См. docs/data.md и docs/plan.md (Фаза 3).

import path from "node:path";
import { fileURLToPath } from "node:url";

import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import { config as loadEnv } from "dotenv";
import { buildConfig } from "payload";
import sharp from "sharp";

import { Categories } from "@/collections/Categories";
import { Leads } from "@/collections/Leads";
import { Media } from "@/collections/Media";
import { Posts } from "@/collections/Posts";
import { Projects } from "@/collections/Projects";
import { Users } from "@/collections/Users";

// Payload CLI (generate/migrate) не подхватывает .env.local сам — грузим явно.
// dotenv не перетирает уже заданные переменные, поэтому под `next dev`
// (где env уже загружен Next) это безвредный no-op.
loadEnv({ path: ".env.local" });
loadEnv({ path: ".env" });

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

// Рантайм (Vercel serverless) — pooled-URL; миграции/DDL — прямое соединение
// без pgbouncer (он не держит транзакции миграционного движка).
const isMigration = process.argv.some((arg) => arg.includes("migrate"));
const connectionString = isMigration
  ? (process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL)
  : (process.env.DATABASE_URL ?? process.env.DATABASE_URL_UNPOOLED);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname, "app/(payload)"),
    },
    meta: {
      title: "ASCI · CMS",
      description: "Контент и блог портфолио",
    },
  },
  collections: [Posts, Projects, Categories, Media, Leads, Users],
  editor: lexicalEditor(),
  localization: {
    locales: [
      { label: "English", code: "en" },
      { label: "Русский", code: "ru" },
    ],
    defaultLocale: "en",
    fallback: true,
  },
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: postgresAdapter({
    pool: { connectionString },
    // Изоляция от Prisma: своя схема Postgres.
    schemaName: "payload",
    // Схему ведём миграциями (коммитим их), а не drizzle push.
    push: false,
    migrationDir: path.resolve(dirname, "migrations"),
  }),
  sharp,
  plugins: [
    // Медиа — в Vercel Blob (если задан токен); иначе локальный диск в dev.
    ...(process.env.BLOB_READ_WRITE_TOKEN
      ? [
          vercelBlobStorage({
            enabled: true,
            collections: { media: true },
            token: process.env.BLOB_READ_WRITE_TOKEN,
          }),
        ]
      : []),
  ],
});
