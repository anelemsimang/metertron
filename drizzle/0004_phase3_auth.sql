-- Phase 3: onboarding, invites, auth tokens, TOTP scaffold

CREATE TYPE "public"."auth_token_kind" AS ENUM('email_verify', 'magic_link', 'password_reset');
--> statement-breakpoint

ALTER TABLE "organisations" ADD COLUMN IF NOT EXISTS "onboarding_completed_at" timestamp with time zone;
--> statement-breakpoint

ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "totp_secret" text;
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "totp_enabled_at" timestamp with time zone;
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "organisation_invites" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "organisation_id" uuid NOT NULL,
  "email" text NOT NULL,
  "role" "membership_role" DEFAULT 'technician' NOT NULL,
  "token" text NOT NULL,
  "invited_by" uuid,
  "expires_at" timestamp with time zone NOT NULL,
  "accepted_at" timestamp with time zone,
  "revoked_at" timestamp with time zone,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "organisation_invites_token_unique" UNIQUE("token")
);
--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "organisation_invites" ADD CONSTRAINT "organisation_invites_organisation_id_organisations_id_fk"
    FOREIGN KEY ("organisation_id") REFERENCES "public"."organisations"("id");
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "organisation_invites" ADD CONSTRAINT "organisation_invites_invited_by_users_id_fk"
    FOREIGN KEY ("invited_by") REFERENCES "public"."users"("id");
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "organisation_invites_org" ON "organisation_invites" ("organisation_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "organisation_invites_email" ON "organisation_invites" ("email");
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "auth_tokens" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" uuid,
  "email" text NOT NULL,
  "kind" "auth_token_kind" NOT NULL,
  "token" text NOT NULL,
  "expires_at" timestamp with time zone NOT NULL,
  "consumed_at" timestamp with time zone,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "auth_tokens_token_unique" UNIQUE("token")
);
--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "auth_tokens" ADD CONSTRAINT "auth_tokens_user_id_users_id_fk"
    FOREIGN KEY ("user_id") REFERENCES "public"."users"("id");
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "auth_tokens_email_kind" ON "auth_tokens" ("email","kind");
--> statement-breakpoint

ALTER TABLE "organisation_invites" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "organisation_invites" FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "auth_tokens" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "auth_tokens" FORCE ROW LEVEL SECURITY;
--> statement-breakpoint

DROP POLICY IF EXISTS organisation_invites_isolation ON organisation_invites;
CREATE POLICY organisation_invites_isolation ON organisation_invites
  USING (app_rls_bypass() OR organisation_id = app_org_id())
  WITH CHECK (app_rls_bypass() OR organisation_id = app_org_id());
--> statement-breakpoint

DROP POLICY IF EXISTS auth_tokens_isolation ON auth_tokens;
CREATE POLICY auth_tokens_isolation ON auth_tokens
  USING (app_rls_bypass())
  WITH CHECK (app_rls_bypass());
