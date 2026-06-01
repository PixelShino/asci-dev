import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "payload"."projects_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "payload"."_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "payload"."projects_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL
  );
  
  CREATE TABLE "payload"."projects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"order" numeric DEFAULT 0,
  	"github_url" varchar,
  	"legacy_folder" varchar,
  	"legacy_image_count" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."projects_locales" (
  	"title" varchar NOT NULL,
  	"short_desc" varchar,
  	"full_desc" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "payload"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "payload"."projects_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD COLUMN "projects_id" integer;
  ALTER TABLE "payload"."projects_features" ADD CONSTRAINT "projects_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."projects_gallery" ADD CONSTRAINT "projects_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."projects_gallery" ADD CONSTRAINT "projects_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."projects_locales" ADD CONSTRAINT "projects_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."projects_texts" ADD CONSTRAINT "projects_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."projects"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "projects_features_order_idx" ON "payload"."projects_features" USING btree ("_order");
  CREATE INDEX "projects_features_parent_id_idx" ON "payload"."projects_features" USING btree ("_parent_id");
  CREATE INDEX "projects_features_locale_idx" ON "payload"."projects_features" USING btree ("_locale");
  CREATE INDEX "projects_gallery_order_idx" ON "payload"."projects_gallery" USING btree ("_order");
  CREATE INDEX "projects_gallery_parent_id_idx" ON "payload"."projects_gallery" USING btree ("_parent_id");
  CREATE INDEX "projects_gallery_image_idx" ON "payload"."projects_gallery" USING btree ("image_id");
  CREATE UNIQUE INDEX "projects_slug_idx" ON "payload"."projects" USING btree ("slug");
  CREATE INDEX "projects_updated_at_idx" ON "payload"."projects" USING btree ("updated_at");
  CREATE INDEX "projects_created_at_idx" ON "payload"."projects" USING btree ("created_at");
  CREATE UNIQUE INDEX "projects_locales_locale_parent_id_unique" ON "payload"."projects_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "projects_texts_order_parent" ON "payload"."projects_texts" USING btree ("order","parent_id");
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "payload"."projects"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_projects_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("projects_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload"."projects_features" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."projects_gallery" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."projects" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."projects_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."projects_texts" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "payload"."projects_features" CASCADE;
  DROP TABLE "payload"."projects_gallery" CASCADE;
  DROP TABLE "payload"."projects" CASCADE;
  DROP TABLE "payload"."projects_locales" CASCADE;
  DROP TABLE "payload"."projects_texts" CASCADE;
  ALTER TABLE "payload"."payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_projects_fk";
  
  DROP INDEX "payload"."payload_locked_documents_rels_projects_id_idx";
  ALTER TABLE "payload"."payload_locked_documents_rels" DROP COLUMN "projects_id";`)
}
