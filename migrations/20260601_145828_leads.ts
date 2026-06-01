import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "payload"."enum_leads_status" AS ENUM('new', 'contacted', 'qualified', 'archived');
  CREATE TABLE "payload"."leads" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"full_name" varchar NOT NULL,
  	"phone" varchar NOT NULL,
  	"company" varchar,
  	"email" varchar NOT NULL,
  	"message" varchar NOT NULL,
  	"status" "payload"."enum_leads_status" DEFAULT 'new',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD COLUMN "leads_id" integer;
  CREATE INDEX "leads_updated_at_idx" ON "payload"."leads" USING btree ("updated_at");
  CREATE INDEX "leads_created_at_idx" ON "payload"."leads" USING btree ("created_at");
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_leads_fk" FOREIGN KEY ("leads_id") REFERENCES "payload"."leads"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_leads_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("leads_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload"."leads" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "payload"."leads" CASCADE;
  ALTER TABLE "payload"."payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_leads_fk";
  
  DROP INDEX "payload"."payload_locked_documents_rels_leads_id_idx";
  ALTER TABLE "payload"."payload_locked_documents_rels" DROP COLUMN "leads_id";
  DROP TYPE "payload"."enum_leads_status";`)
}
