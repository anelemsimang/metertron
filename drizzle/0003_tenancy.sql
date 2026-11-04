-- Phase 2: multi-tenant columns, memberships, export templates, RLS.
-- Reversible via 0003_tenancy.down.sql

CREATE TYPE "public"."membership_role" AS ENUM('owner', 'admin', 'supervisor', 'technician', 'viewer');
--> statement-breakpoint
CREATE TYPE "public"."org_status" AS ENUM('trialing', 'active', 'past_due', 'readonly', 'suspended', 'deleted');
--> statement-breakpoint

ALTER TABLE "organisations"
  ADD COLUMN IF NOT EXISTS "status" "org_status" DEFAULT 'trialing' NOT NULL,
  ADD COLUMN IF NOT EXISTS "plan_key" text DEFAULT 'trial' NOT NULL,
  ADD COLUMN IF NOT EXISTS "trial_ends_at" timestamp with time zone,
  ADD COLUMN IF NOT EXISTS "locale" text DEFAULT 'en-ZA' NOT NULL,
  ADD COLUMN IF NOT EXISTS "timezone" text DEFAULT 'Africa/Johannesburg' NOT NULL,
  ADD COLUMN IF NOT EXISTS "currency" text DEFAULT 'ZAR' NOT NULL,
  ADD COLUMN IF NOT EXISTS "vat_rate_bps" integer DEFAULT 1500 NOT NULL,
  ADD COLUMN IF NOT EXISTS "vat_number" text,
  ADD COLUMN IF NOT EXISTS "logo_url" text,
  ADD COLUMN IF NOT EXISTS "support_access_allowed" boolean DEFAULT true NOT NULL,
  ADD COLUMN IF NOT EXISTS "support_access_requires_approval" boolean DEFAULT false NOT NULL,
  ADD COLUMN IF NOT EXISTS "custom_domain" text;
--> statement-breakpoint

ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "password_hash" text;
--> statement-breakpoint

ALTER TABLE "sessions" ADD COLUMN IF NOT EXISTS "organisation_id" uuid;
--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "sessions" ADD CONSTRAINT "sessions_organisation_id_organisations_id_fk"
    FOREIGN KEY ("organisation_id") REFERENCES "public"."organisations"("id");
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "organisation_memberships" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "organisation_id" uuid NOT NULL,
  "user_id" uuid NOT NULL,
  "role" "membership_role" NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "organisation_memberships" ADD CONSTRAINT "organisation_memberships_organisation_id_organisations_id_fk"
    FOREIGN KEY ("organisation_id") REFERENCES "public"."organisations"("id");
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "organisation_memberships" ADD CONSTRAINT "organisation_memberships_user_id_users_id_fk"
    FOREIGN KEY ("user_id") REFERENCES "public"."users"("id");
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "organisation_memberships_user_org" ON "organisation_memberships" ("user_id","organisation_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "organisation_memberships_org" ON "organisation_memberships" ("organisation_id");
--> statement-breakpoint

-- Backfill memberships from users
INSERT INTO "organisation_memberships" ("organisation_id", "user_id", "role")
SELECT
  u.organisation_id,
  u.id,
  CASE u.org_role
    WHEN 'head' THEN 'owner'::membership_role
    WHEN 'admin' THEN 'admin'::membership_role
    ELSE 'technician'::membership_role
  END
FROM users u
ON CONFLICT DO NOTHING;
--> statement-breakpoint

-- Contract-scoped children: add organisation_id and backfill
ALTER TABLE "contract_grants" ADD COLUMN IF NOT EXISTS "organisation_id" uuid;
--> statement-breakpoint
UPDATE "contract_grants" g SET organisation_id = c.organisation_id FROM contracts c WHERE g.contract_id = c.id AND g.organisation_id IS NULL;
--> statement-breakpoint
ALTER TABLE "contract_grants" ALTER COLUMN "organisation_id" SET NOT NULL;
--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "contract_grants" ADD CONSTRAINT "contract_grants_organisation_id_organisations_id_fk"
    FOREIGN KEY ("organisation_id") REFERENCES "public"."organisations"("id");
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "contract_grants_org" ON "contract_grants" ("organisation_id");
--> statement-breakpoint

ALTER TABLE "towns" ADD COLUMN IF NOT EXISTS "organisation_id" uuid;
--> statement-breakpoint
UPDATE "towns" t SET organisation_id = c.organisation_id FROM contracts c WHERE t.contract_id = c.id AND t.organisation_id IS NULL;
--> statement-breakpoint
ALTER TABLE "towns" ALTER COLUMN "organisation_id" SET NOT NULL;
--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "towns" ADD CONSTRAINT "towns_organisation_id_organisations_id_fk"
    FOREIGN KEY ("organisation_id") REFERENCES "public"."organisations"("id");
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "towns_org" ON "towns" ("organisation_id");
--> statement-breakpoint

ALTER TABLE "installers" ADD COLUMN IF NOT EXISTS "organisation_id" uuid;
--> statement-breakpoint
UPDATE "installers" i SET organisation_id = c.organisation_id FROM contracts c WHERE i.contract_id = c.id AND i.organisation_id IS NULL;
--> statement-breakpoint
ALTER TABLE "installers" ALTER COLUMN "organisation_id" SET NOT NULL;
--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "installers" ADD CONSTRAINT "installers_organisation_id_organisations_id_fk"
    FOREIGN KEY ("organisation_id") REFERENCES "public"."organisations"("id");
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "installers_org" ON "installers" ("organisation_id");
--> statement-breakpoint

ALTER TABLE "meter_sizes" ADD COLUMN IF NOT EXISTS "organisation_id" uuid;
--> statement-breakpoint
UPDATE "meter_sizes" m SET organisation_id = c.organisation_id FROM contracts c WHERE m.contract_id = c.id AND m.organisation_id IS NULL;
--> statement-breakpoint
ALTER TABLE "meter_sizes" ALTER COLUMN "organisation_id" SET NOT NULL;
--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "meter_sizes" ADD CONSTRAINT "meter_sizes_organisation_id_organisations_id_fk"
    FOREIGN KEY ("organisation_id") REFERENCES "public"."organisations"("id");
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "meter_sizes_org" ON "meter_sizes" ("organisation_id");
--> statement-breakpoint

ALTER TABLE "meter_classes" ADD COLUMN IF NOT EXISTS "organisation_id" uuid;
--> statement-breakpoint
UPDATE "meter_classes" m SET organisation_id = c.organisation_id FROM contracts c WHERE m.contract_id = c.id AND m.organisation_id IS NULL;
--> statement-breakpoint
ALTER TABLE "meter_classes" ALTER COLUMN "organisation_id" SET NOT NULL;
--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "meter_classes" ADD CONSTRAINT "meter_classes_organisation_id_organisations_id_fk"
    FOREIGN KEY ("organisation_id") REFERENCES "public"."organisations"("id");
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "meter_classes_org" ON "meter_classes" ("organisation_id");
--> statement-breakpoint

ALTER TABLE "meter_types" ADD COLUMN IF NOT EXISTS "organisation_id" uuid;
--> statement-breakpoint
UPDATE "meter_types" m SET organisation_id = c.organisation_id FROM contracts c WHERE m.contract_id = c.id AND m.organisation_id IS NULL;
--> statement-breakpoint
ALTER TABLE "meter_types" ALTER COLUMN "organisation_id" SET NOT NULL;
--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "meter_types" ADD CONSTRAINT "meter_types_organisation_id_organisations_id_fk"
    FOREIGN KEY ("organisation_id") REFERENCES "public"."organisations"("id");
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "meter_types_org" ON "meter_types" ("organisation_id");
--> statement-breakpoint

ALTER TABLE "form_versions" ADD COLUMN IF NOT EXISTS "organisation_id" uuid;
--> statement-breakpoint
UPDATE "form_versions" f SET organisation_id = c.organisation_id FROM contracts c WHERE f.contract_id = c.id AND f.organisation_id IS NULL;
--> statement-breakpoint
ALTER TABLE "form_versions" ALTER COLUMN "organisation_id" SET NOT NULL;
--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "form_versions" ADD CONSTRAINT "form_versions_organisation_id_organisations_id_fk"
    FOREIGN KEY ("organisation_id") REFERENCES "public"."organisations"("id");
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "form_versions_org" ON "form_versions" ("organisation_id");
--> statement-breakpoint

ALTER TABLE "job_faults" ADD COLUMN IF NOT EXISTS "organisation_id" uuid;
--> statement-breakpoint
UPDATE "job_faults" f SET organisation_id = j.organisation_id FROM jobs j WHERE f.job_id = j.id AND f.organisation_id IS NULL;
--> statement-breakpoint
ALTER TABLE "job_faults" ALTER COLUMN "organisation_id" SET NOT NULL;
--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "job_faults" ADD CONSTRAINT "job_faults_organisation_id_organisations_id_fk"
    FOREIGN KEY ("organisation_id") REFERENCES "public"."organisations"("id");
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "job_faults_org" ON "job_faults" ("organisation_id");
--> statement-breakpoint

ALTER TABLE "job_photos" ADD COLUMN IF NOT EXISTS "organisation_id" uuid;
--> statement-breakpoint
ALTER TABLE "job_photos" ADD COLUMN IF NOT EXISTS "content_sha256" text;
--> statement-breakpoint
UPDATE "job_photos" p SET organisation_id = j.organisation_id FROM jobs j WHERE p.job_id = j.id AND p.organisation_id IS NULL;
--> statement-breakpoint
ALTER TABLE "job_photos" ALTER COLUMN "organisation_id" SET NOT NULL;
--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "job_photos" ADD CONSTRAINT "job_photos_organisation_id_organisations_id_fk"
    FOREIGN KEY ("organisation_id") REFERENCES "public"."organisations"("id");
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DROP INDEX IF EXISTS "job_photos_idempotency";
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "job_photos_idempotency" ON "job_photos" ("organisation_id","idempotency_key");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "job_photos_org" ON "job_photos" ("organisation_id");
--> statement-breakpoint

ALTER TABLE "quality_flags" ADD COLUMN IF NOT EXISTS "organisation_id" uuid;
--> statement-breakpoint
UPDATE "quality_flags" q SET organisation_id = j.organisation_id FROM jobs j WHERE q.job_id = j.id AND q.organisation_id IS NULL;
--> statement-breakpoint
-- orphan flags (none expected): drop if still null
DELETE FROM "quality_flags" WHERE organisation_id IS NULL;
--> statement-breakpoint
ALTER TABLE "quality_flags" ALTER COLUMN "organisation_id" SET NOT NULL;
--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "quality_flags" ADD CONSTRAINT "quality_flags_organisation_id_organisations_id_fk"
    FOREIGN KEY ("organisation_id") REFERENCES "public"."organisations"("id");
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "quality_flags_org" ON "quality_flags" ("organisation_id");
--> statement-breakpoint

ALTER TABLE "audit_events" ADD COLUMN IF NOT EXISTS "organisation_id" uuid;
--> statement-breakpoint
UPDATE "audit_events" a SET organisation_id = j.organisation_id FROM jobs j WHERE a.job_id = j.id AND a.organisation_id IS NULL;
--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "audit_events" ADD CONSTRAINT "audit_events_organisation_id_organisations_id_fk"
    FOREIGN KEY ("organisation_id") REFERENCES "public"."organisations"("id");
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "audit_events_org" ON "audit_events" ("organisation_id");
--> statement-breakpoint

ALTER TABLE "export_runs" ADD COLUMN IF NOT EXISTS "organisation_id" uuid;
--> statement-breakpoint
UPDATE "export_runs" e SET organisation_id = c.organisation_id FROM contracts c WHERE e.contract_id = c.id AND e.organisation_id IS NULL;
--> statement-breakpoint
DELETE FROM "export_runs" WHERE organisation_id IS NULL;
--> statement-breakpoint
ALTER TABLE "export_runs" ALTER COLUMN "organisation_id" SET NOT NULL;
--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "export_runs" ADD CONSTRAINT "export_runs_organisation_id_organisations_id_fk"
    FOREIGN KEY ("organisation_id") REFERENCES "public"."organisations"("id");
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "export_runs_org" ON "export_runs" ("organisation_id");
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "export_templates" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "organisation_id" uuid NOT NULL,
  "key" text NOT NULL,
  "name" text NOT NULL,
  "sheet_name" text DEFAULT 'Main' NOT NULL,
  "status_export_value" text DEFAULT 'Final' NOT NULL,
  "headers" jsonb NOT NULL,
  "map_headers" jsonb DEFAULT '[]'::jsonb NOT NULL,
  "list_phrases" jsonb NOT NULL,
  "source_builtin" text,
  "is_default" boolean DEFAULT false NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "export_templates" ADD CONSTRAINT "export_templates_organisation_id_organisations_id_fk"
    FOREIGN KEY ("organisation_id") REFERENCES "public"."organisations"("id");
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "export_templates_org_key" ON "export_templates" ("organisation_id","key");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "export_templates_org" ON "export_templates" ("organisation_id");
--> statement-breakpoint

-- RLS helper: org match or explicit bypass (migrations / platform)
CREATE OR REPLACE FUNCTION app_org_id() RETURNS uuid AS $$
  SELECT NULLIF(current_setting('app.current_org_id', true), '')::uuid;
$$ LANGUAGE sql STABLE;
--> statement-breakpoint

CREATE OR REPLACE FUNCTION app_rls_bypass() RETURNS boolean AS $$
  SELECT COALESCE(current_setting('app.bypass_rls', true), '') = 'on';
$$ LANGUAGE sql STABLE;
--> statement-breakpoint

DO $$
DECLARE
  t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'organisations',
    'organisation_memberships',
    'users',
    'sessions',
    'contracts',
    'contract_grants',
    'towns',
    'installers',
    'meter_sizes',
    'meter_classes',
    'meter_types',
    'form_versions',
    'work_orders',
    'jobs',
    'job_faults',
    'job_photos',
    'quality_flags',
    'audit_events',
    'stock_items',
    'stock_movements',
    'export_runs',
    'export_templates'
  ]
  LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('ALTER TABLE %I FORCE ROW LEVEL SECURITY', t);
  END LOOP;
END $$;
--> statement-breakpoint

-- organisations: members see their own org row
DROP POLICY IF EXISTS organisations_isolation ON organisations;
CREATE POLICY organisations_isolation ON organisations
  USING (app_rls_bypass() OR id = app_org_id())
  WITH CHECK (app_rls_bypass() OR id = app_org_id());
--> statement-breakpoint

DROP POLICY IF EXISTS organisation_memberships_isolation ON organisation_memberships;
CREATE POLICY organisation_memberships_isolation ON organisation_memberships
  USING (app_rls_bypass() OR organisation_id = app_org_id())
  WITH CHECK (app_rls_bypass() OR organisation_id = app_org_id());
--> statement-breakpoint

DROP POLICY IF EXISTS users_isolation ON users;
CREATE POLICY users_isolation ON users
  USING (app_rls_bypass() OR organisation_id = app_org_id())
  WITH CHECK (app_rls_bypass() OR organisation_id = app_org_id());
--> statement-breakpoint

DROP POLICY IF EXISTS sessions_isolation ON sessions;
CREATE POLICY sessions_isolation ON sessions
  USING (
    app_rls_bypass()
    OR organisation_id = app_org_id()
    OR organisation_id IS NULL
    OR EXISTS (SELECT 1 FROM users u WHERE u.id = sessions.user_id AND u.organisation_id = app_org_id())
  )
  WITH CHECK (app_rls_bypass() OR organisation_id = app_org_id() OR organisation_id IS NULL);
--> statement-breakpoint

DROP POLICY IF EXISTS contracts_isolation ON contracts;
CREATE POLICY contracts_isolation ON contracts
  USING (app_rls_bypass() OR organisation_id = app_org_id())
  WITH CHECK (app_rls_bypass() OR organisation_id = app_org_id());
--> statement-breakpoint

DROP POLICY IF EXISTS contract_grants_isolation ON contract_grants;
CREATE POLICY contract_grants_isolation ON contract_grants
  USING (app_rls_bypass() OR organisation_id = app_org_id())
  WITH CHECK (app_rls_bypass() OR organisation_id = app_org_id());
--> statement-breakpoint

DROP POLICY IF EXISTS towns_isolation ON towns;
CREATE POLICY towns_isolation ON towns
  USING (app_rls_bypass() OR organisation_id = app_org_id())
  WITH CHECK (app_rls_bypass() OR organisation_id = app_org_id());
--> statement-breakpoint

DROP POLICY IF EXISTS installers_isolation ON installers;
CREATE POLICY installers_isolation ON installers
  USING (app_rls_bypass() OR organisation_id = app_org_id())
  WITH CHECK (app_rls_bypass() OR organisation_id = app_org_id());
--> statement-breakpoint

DROP POLICY IF EXISTS meter_sizes_isolation ON meter_sizes;
CREATE POLICY meter_sizes_isolation ON meter_sizes
  USING (app_rls_bypass() OR organisation_id = app_org_id())
  WITH CHECK (app_rls_bypass() OR organisation_id = app_org_id());
--> statement-breakpoint

DROP POLICY IF EXISTS meter_classes_isolation ON meter_classes;
CREATE POLICY meter_classes_isolation ON meter_classes
  USING (app_rls_bypass() OR organisation_id = app_org_id())
  WITH CHECK (app_rls_bypass() OR organisation_id = app_org_id());
--> statement-breakpoint

DROP POLICY IF EXISTS meter_types_isolation ON meter_types;
CREATE POLICY meter_types_isolation ON meter_types
  USING (app_rls_bypass() OR organisation_id = app_org_id())
  WITH CHECK (app_rls_bypass() OR organisation_id = app_org_id());
--> statement-breakpoint

DROP POLICY IF EXISTS form_versions_isolation ON form_versions;
CREATE POLICY form_versions_isolation ON form_versions
  USING (app_rls_bypass() OR organisation_id = app_org_id())
  WITH CHECK (app_rls_bypass() OR organisation_id = app_org_id());
--> statement-breakpoint

DROP POLICY IF EXISTS work_orders_isolation ON work_orders;
CREATE POLICY work_orders_isolation ON work_orders
  USING (app_rls_bypass() OR organisation_id = app_org_id())
  WITH CHECK (app_rls_bypass() OR organisation_id = app_org_id());
--> statement-breakpoint

DROP POLICY IF EXISTS jobs_isolation ON jobs;
CREATE POLICY jobs_isolation ON jobs
  USING (app_rls_bypass() OR organisation_id = app_org_id())
  WITH CHECK (app_rls_bypass() OR organisation_id = app_org_id());
--> statement-breakpoint

DROP POLICY IF EXISTS job_faults_isolation ON job_faults;
CREATE POLICY job_faults_isolation ON job_faults
  USING (app_rls_bypass() OR organisation_id = app_org_id())
  WITH CHECK (app_rls_bypass() OR organisation_id = app_org_id());
--> statement-breakpoint

DROP POLICY IF EXISTS job_photos_isolation ON job_photos;
CREATE POLICY job_photos_isolation ON job_photos
  USING (app_rls_bypass() OR organisation_id = app_org_id())
  WITH CHECK (app_rls_bypass() OR organisation_id = app_org_id());
--> statement-breakpoint

DROP POLICY IF EXISTS quality_flags_isolation ON quality_flags;
CREATE POLICY quality_flags_isolation ON quality_flags
  USING (app_rls_bypass() OR organisation_id = app_org_id())
  WITH CHECK (app_rls_bypass() OR organisation_id = app_org_id());
--> statement-breakpoint

DROP POLICY IF EXISTS audit_events_isolation ON audit_events;
CREATE POLICY audit_events_isolation ON audit_events
  USING (app_rls_bypass() OR organisation_id = app_org_id() OR organisation_id IS NULL)
  WITH CHECK (app_rls_bypass() OR organisation_id = app_org_id());
--> statement-breakpoint

DROP POLICY IF EXISTS stock_items_isolation ON stock_items;
CREATE POLICY stock_items_isolation ON stock_items
  USING (app_rls_bypass() OR organisation_id = app_org_id())
  WITH CHECK (app_rls_bypass() OR organisation_id = app_org_id());
--> statement-breakpoint

DROP POLICY IF EXISTS stock_movements_isolation ON stock_movements;
CREATE POLICY stock_movements_isolation ON stock_movements
  USING (app_rls_bypass() OR organisation_id = app_org_id())
  WITH CHECK (app_rls_bypass() OR organisation_id = app_org_id());
--> statement-breakpoint

DROP POLICY IF EXISTS export_runs_isolation ON export_runs;
CREATE POLICY export_runs_isolation ON export_runs
  USING (app_rls_bypass() OR organisation_id = app_org_id())
  WITH CHECK (app_rls_bypass() OR organisation_id = app_org_id());
--> statement-breakpoint

DROP POLICY IF EXISTS export_templates_isolation ON export_templates;
CREATE POLICY export_templates_isolation ON export_templates
  USING (app_rls_bypass() OR organisation_id = app_org_id())
  WITH CHECK (app_rls_bypass() OR organisation_id = app_org_id());
