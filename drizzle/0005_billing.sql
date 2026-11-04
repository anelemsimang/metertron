-- Phase 5: plans, subscriptions, usage, invoices, billing events

CREATE TYPE "public"."billing_interval" AS ENUM('monthly', 'annual');
--> statement-breakpoint
CREATE TYPE "public"."subscription_status" AS ENUM('trialing', 'active', 'past_due', 'grace', 'cancelled', 'expired');
--> statement-breakpoint
CREATE TYPE "public"."invoice_status" AS ENUM('draft', 'open', 'paid', 'void', 'uncollectible');
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "plans" (
  "key" text PRIMARY KEY NOT NULL,
  "name" text NOT NULL,
  "description" text DEFAULT '' NOT NULL,
  "amount_monthly_zar_cents" integer,
  "seat_limit" integer,
  "installs_per_month" integer,
  "storage_bytes" bigint,
  "paystack_plan_code_monthly" text,
  "paystack_plan_code_annual" text,
  "is_public" boolean DEFAULT true NOT NULL,
  "sort_order" integer DEFAULT 0 NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "organisation_subscriptions" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "organisation_id" uuid NOT NULL,
  "plan_key" text NOT NULL,
  "interval" "billing_interval" DEFAULT 'monthly' NOT NULL,
  "status" "subscription_status" DEFAULT 'trialing' NOT NULL,
  "paystack_customer_code" text,
  "paystack_subscription_code" text,
  "current_period_start" timestamp with time zone,
  "current_period_end" timestamp with time zone,
  "grace_ends_at" timestamp with time zone,
  "cancelled_at" timestamp with time zone,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "organisation_subscriptions" ADD CONSTRAINT "organisation_subscriptions_organisation_id_organisations_id_fk"
    FOREIGN KEY ("organisation_id") REFERENCES "public"."organisations"("id");
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "organisation_subscriptions" ADD CONSTRAINT "organisation_subscriptions_plan_key_plans_key_fk"
    FOREIGN KEY ("plan_key") REFERENCES "public"."plans"("key");
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "organisation_subscriptions_org" ON "organisation_subscriptions" ("organisation_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "organisation_subscriptions_plan" ON "organisation_subscriptions" ("plan_key");
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "usage_periods" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "organisation_id" uuid NOT NULL,
  "period_start" timestamp with time zone NOT NULL,
  "period_end" timestamp with time zone NOT NULL,
  "seats_used" integer DEFAULT 0 NOT NULL,
  "installs_count" integer DEFAULT 0 NOT NULL,
  "storage_bytes" bigint DEFAULT 0 NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "usage_periods" ADD CONSTRAINT "usage_periods_organisation_id_organisations_id_fk"
    FOREIGN KEY ("organisation_id") REFERENCES "public"."organisations"("id");
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "usage_periods_org_start" ON "usage_periods" ("organisation_id","period_start");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "usage_periods_org" ON "usage_periods" ("organisation_id");
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "invoices" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "organisation_id" uuid NOT NULL,
  "number" text NOT NULL,
  "status" "invoice_status" DEFAULT 'draft' NOT NULL,
  "currency" text DEFAULT 'ZAR' NOT NULL,
  "subtotal_zar_cents" integer NOT NULL,
  "vat_rate_bps" integer DEFAULT 1500 NOT NULL,
  "vat_zar_cents" integer NOT NULL,
  "total_zar_cents" integer NOT NULL,
  "vat_number" text,
  "paystack_reference" text,
  "line_items" jsonb DEFAULT '[]'::jsonb NOT NULL,
  "period_start" timestamp with time zone,
  "period_end" timestamp with time zone,
  "paid_at" timestamp with time zone,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "invoices" ADD CONSTRAINT "invoices_organisation_id_organisations_id_fk"
    FOREIGN KEY ("organisation_id") REFERENCES "public"."organisations"("id");
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "invoices_org_number" ON "invoices" ("organisation_id","number");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "invoices_org" ON "invoices" ("organisation_id");
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "billing_events" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "organisation_id" uuid,
  "kind" text NOT NULL,
  "provider" text DEFAULT 'paystack' NOT NULL,
  "external_id" text,
  "payload" jsonb DEFAULT '{}'::jsonb NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "billing_events" ADD CONSTRAINT "billing_events_organisation_id_organisations_id_fk"
    FOREIGN KEY ("organisation_id") REFERENCES "public"."organisations"("id");
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "billing_events_org" ON "billing_events" ("organisation_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "billing_events_kind" ON "billing_events" ("kind");
--> statement-breakpoint

ALTER TABLE "plans" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "plans" FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "organisation_subscriptions" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "organisation_subscriptions" FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "usage_periods" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "usage_periods" FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "invoices" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "invoices" FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "billing_events" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "billing_events" FORCE ROW LEVEL SECURITY;
--> statement-breakpoint

DROP POLICY IF EXISTS plans_read ON plans;
CREATE POLICY plans_read ON plans
  USING (app_rls_bypass() OR is_public = true)
  WITH CHECK (app_rls_bypass());
--> statement-breakpoint

DROP POLICY IF EXISTS organisation_subscriptions_isolation ON organisation_subscriptions;
CREATE POLICY organisation_subscriptions_isolation ON organisation_subscriptions
  USING (app_rls_bypass() OR organisation_id = app_org_id())
  WITH CHECK (app_rls_bypass() OR organisation_id = app_org_id());
--> statement-breakpoint

DROP POLICY IF EXISTS usage_periods_isolation ON usage_periods;
CREATE POLICY usage_periods_isolation ON usage_periods
  USING (app_rls_bypass() OR organisation_id = app_org_id())
  WITH CHECK (app_rls_bypass() OR organisation_id = app_org_id());
--> statement-breakpoint

DROP POLICY IF EXISTS invoices_isolation ON invoices;
CREATE POLICY invoices_isolation ON invoices
  USING (app_rls_bypass() OR organisation_id = app_org_id())
  WITH CHECK (app_rls_bypass() OR organisation_id = app_org_id());
--> statement-breakpoint

DROP POLICY IF EXISTS billing_events_isolation ON billing_events;
CREATE POLICY billing_events_isolation ON billing_events
  USING (app_rls_bypass() OR organisation_id = app_org_id() OR organisation_id IS NULL)
  WITH CHECK (app_rls_bypass() OR organisation_id = app_org_id());
--> statement-breakpoint

INSERT INTO "plans" ("key", "name", "description", "amount_monthly_zar_cents", "seat_limit", "installs_per_month", "storage_bytes", "is_public", "sort_order")
VALUES
  ('trial', 'Trial', '14-day trial — no card required', 0, 5, 100, 1073741824, true, 0),
  ('starter', 'Starter', 'Small crews capturing installs in the field', 149000, 10, 500, 10737418240, true, 1),
  ('growth', 'Growth', 'Growing contractors with higher volume', 399000, 40, 2500, 53687091200, true, 2),
  ('enterprise', 'Enterprise', 'Custom limits, SSO hooks, and dedicated support', NULL, NULL, NULL, NULL, true, 3)
ON CONFLICT ("key") DO NOTHING;
