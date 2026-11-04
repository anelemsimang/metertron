-- Remove multi-tier legacy plans; Metertron is the only commercial plan.
-- Trial is a subscription status on the Metertron plan, not a separate plan row.

UPDATE "organisations" SET "plan_key" = 'metertron', "updated_at" = now()
WHERE "plan_key" IS DISTINCT FROM 'metertron';
--> statement-breakpoint

UPDATE "organisation_subscriptions" SET "plan_key" = 'metertron', "updated_at" = now()
WHERE "plan_key" IS DISTINCT FROM 'metertron';
--> statement-breakpoint

DELETE FROM "plans" WHERE "key" <> 'metertron';
--> statement-breakpoint

UPDATE "plans" SET
  "name" = 'Metertron',
  "description" = 'Full Metertron access for your organisation — field capture, review, exports, and team management.',
  "amount_monthly_zar_cents" = 149000,
  "seat_limit" = NULL,
  "installs_per_month" = NULL,
  "storage_bytes" = NULL,
  "is_public" = true,
  "sort_order" = 0,
  "updated_at" = now()
WHERE "key" = 'metertron';
