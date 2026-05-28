import { defineConfig } from "prisma/config";
import { config as loadEnv } from "dotenv";
import { resolve } from "node:path";

// Prisma 7 не подхватывает .env.local автоматически — подгружаем явно.
loadEnv({ path: resolve(process.cwd(), ".env.local") });
loadEnv({ path: resolve(process.cwd(), ".env") });

export default defineConfig({
  schema: "prisma/schema.prisma",
  // Direct URL для миграций: у Neon pooled-соединение через pgbouncer
  // не подходит для миграционного движка (нужны постоянные транзакции).
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL,
  },
});
