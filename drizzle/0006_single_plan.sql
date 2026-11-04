-- One Metertron subscription plan per organisation; full feature access.

INSERT INTO "plans" (
  "key", "name", "description", "amount_monthly_zar_cents",
  "seat_limit", "installs_per_month", "storage_bytes", "is_public", "sort_order", "updated_at"
)
VALUES (
  'metertron',
  'Metertron',
  'Full Metertron access for your organisation — field capture, review, exports, and team management.',
  149000,
  NULL,
  NULL,
  NULL,
  true,
  0,
  now()
)
ON CONFLICT ("key") DO UPDATE SET
  "name" = EXCLUDED."name",
  "description" = EXCLUDED."description",
  "amount_monthly_zar_cents" = EXCLUDED."amount_monthly_zar_cents",
  "seat_limit" = NULL,
  "installs_per_month" = NULL,
  "storage_bytes" = NULL,
  "is_public" = true,
  "sort_order" = 0,
  "updated_at" = now();
--> statement-breakpoint

UPDATE "organisations" SET "plan_key" = 'metertron', "updated_at" = now()
WHERE "plan_key" IS DISTINCT FROM 'metertron';
--> statement-breakpoint

UPDATE "organisation_subscriptions" SET "plan_key" = 'metertron', "updated_at" = now()
WHERE "plan_key" IS DISTINCT FROM 'metertron';
--> statement-breakpoint

UPDATE "plans" SET "is_public" = false, "updated_at" = now()
WHERE "key" <> 'metertron';
