-- Reverse Phase 3 auth objects only. Does not touch Phase 2 tenancy / client data.

DROP POLICY IF EXISTS auth_tokens_isolation ON auth_tokens;
--> statement-breakpoint
DROP POLICY IF EXISTS organisation_invites_isolation ON organisation_invites;
--> statement-breakpoint

DROP TABLE IF EXISTS "auth_tokens";
--> statement-breakpoint
DROP TABLE IF EXISTS "organisation_invites";
--> statement-breakpoint

ALTER TABLE "users" DROP COLUMN IF EXISTS "totp_enabled_at";
--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "totp_secret";
--> statement-breakpoint
ALTER TABLE "organisations" DROP COLUMN IF EXISTS "onboarding_completed_at";
--> statement-breakpoint

DROP TYPE IF EXISTS "public"."auth_token_kind";
