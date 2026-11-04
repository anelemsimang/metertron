-- Missing from 0003: work_orders + stock_items organisation_id (empty DB safe)

ALTER TABLE "work_orders" ADD COLUMN IF NOT EXISTS "organisation_id" uuid;
--> statement-breakpoint
ALTER TABLE "work_orders" ADD COLUMN IF NOT EXISTS "town_name" text;
--> statement-breakpoint
UPDATE "work_orders" w
SET organisation_id = c.organisation_id
FROM contracts c
WHERE w.contract_id = c.id AND w.organisation_id IS NULL;
--> statement-breakpoint
-- Empty / unscoped rows: leave nullable only until we can set NOT NULL; on fresh DB there are none.
DELETE FROM "work_orders" WHERE organisation_id IS NULL AND contract_id IS NULL;
--> statement-breakpoint
-- For any remaining with contract, already filled; if still null on fresh DB, nothing to do.
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM work_orders WHERE organisation_id IS NULL) THEN
    RAISE EXCEPTION 'work_orders rows missing organisation_id';
  END IF;
END $$;
--> statement-breakpoint
ALTER TABLE "work_orders" ALTER COLUMN "organisation_id" SET NOT NULL;
--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "work_orders" ADD CONSTRAINT "work_orders_organisation_id_organisations_id_fk"
    FOREIGN KEY ("organisation_id") REFERENCES "public"."organisations"("id");
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "work_orders_org" ON "work_orders" ("organisation_id");
--> statement-breakpoint

ALTER TABLE "stock_items" ADD COLUMN IF NOT EXISTS "organisation_id" uuid;
--> statement-breakpoint
UPDATE "stock_items" s
SET organisation_id = c.organisation_id
FROM contracts c
WHERE s.contract_id = c.id AND s.organisation_id IS NULL;
--> statement-breakpoint
DELETE FROM "stock_items" WHERE organisation_id IS NULL;
--> statement-breakpoint
ALTER TABLE "stock_items" ALTER COLUMN "organisation_id" SET NOT NULL;
--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "stock_items" ADD CONSTRAINT "stock_items_organisation_id_organisations_id_fk"
    FOREIGN KEY ("organisation_id") REFERENCES "public"."organisations"("id");
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DROP INDEX IF EXISTS "stock_items_contract_serial";
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "stock_items_org_serial" ON "stock_items" ("organisation_id","kind","serial");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "stock_items_org" ON "stock_items" ("organisation_id");
