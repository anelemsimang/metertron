-- Phase 8 — public API keys + outbound webhooks

CREATE TABLE IF NOT EXISTS "api_keys" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "organisation_id" uuid NOT NULL REFERENCES "organisations"("id"),
  "name" text NOT NULL,
  "key_prefix" text NOT NULL,
  "key_hash" text NOT NULL,
  "scopes" jsonb DEFAULT '["read:jobs"]'::jsonb NOT NULL,
  "last_used_at" timestamp with time zone,
  "revoked_at" timestamp with time zone,
  "created_by_user_id" uuid REFERENCES "users"("id"),
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint

CREATE UNIQUE INDEX IF NOT EXISTS "api_keys_prefix" ON "api_keys" ("key_prefix");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "api_keys_org" ON "api_keys" ("organisation_id");
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "webhook_endpoints" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "organisation_id" uuid NOT NULL REFERENCES "organisations"("id"),
  "url" text NOT NULL,
  "secret" text NOT NULL,
  "events" jsonb DEFAULT '["job.approved","job.rejected"]'::jsonb NOT NULL,
  "disabled_at" timestamp with time zone,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "webhook_endpoints_org" ON "webhook_endpoints" ("organisation_id");
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "webhook_deliveries" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "organisation_id" uuid NOT NULL REFERENCES "organisations"("id"),
  "endpoint_id" uuid NOT NULL REFERENCES "webhook_endpoints"("id"),
  "event" text NOT NULL,
  "payload" jsonb DEFAULT '{}'::jsonb NOT NULL,
  "status_code" integer,
  "success" boolean DEFAULT false NOT NULL,
  "error" text,
  "attempted_at" timestamp with time zone DEFAULT now() NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "webhook_deliveries_org" ON "webhook_deliveries" ("organisation_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "webhook_deliveries_endpoint" ON "webhook_deliveries" ("endpoint_id");
