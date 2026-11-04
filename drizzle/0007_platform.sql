-- Phase 6 — Metertron platform control panel

CREATE TYPE "public"."platform_staff_role" AS ENUM('owner', 'admin', 'support', 'readonly');
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "platform_staff" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "email" text NOT NULL,
  "name" text NOT NULL,
  "password_hash" text NOT NULL,
  "role" "platform_staff_role" DEFAULT 'support' NOT NULL,
  "totp_secret" text,
  "totp_enabled_at" timestamp with time zone,
  "disabled_at" timestamp with time zone,
  "last_login_at" timestamp with time zone,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint

CREATE UNIQUE INDEX IF NOT EXISTS "platform_staff_email" ON "platform_staff" ("email");
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "platform_sessions" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "staff_id" uuid NOT NULL REFERENCES "platform_staff"("id"),
  "token" text NOT NULL UNIQUE,
  "expires_at" timestamp with time zone NOT NULL,
  "totp_verified_at" timestamp with time zone,
  "ip_address" text,
  "user_agent" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "platform_sessions_staff" ON "platform_sessions" ("staff_id");
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "platform_audit_events" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "staff_id" uuid REFERENCES "platform_staff"("id"),
  "organisation_id" uuid REFERENCES "organisations"("id"),
  "action" text NOT NULL,
  "target_type" text,
  "target_id" text,
  "summary" text DEFAULT '' NOT NULL,
  "payload" jsonb DEFAULT '{}'::jsonb NOT NULL,
  "ip_address" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "platform_audit_events_staff" ON "platform_audit_events" ("staff_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "platform_audit_events_org" ON "platform_audit_events" ("organisation_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "platform_audit_events_action" ON "platform_audit_events" ("action");
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "support_access_events" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "organisation_id" uuid NOT NULL REFERENCES "organisations"("id"),
  "staff_id" uuid REFERENCES "platform_staff"("id"),
  "staff_email" text NOT NULL,
  "staff_name" text NOT NULL,
  "reason" text DEFAULT '' NOT NULL,
  "started_at" timestamp with time zone DEFAULT now() NOT NULL,
  "ended_at" timestamp with time zone,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "support_access_events_org" ON "support_access_events" ("organisation_id");
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "platform_support_sessions" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "staff_id" uuid NOT NULL REFERENCES "platform_staff"("id"),
  "organisation_id" uuid NOT NULL REFERENCES "organisations"("id"),
  "access_event_id" uuid REFERENCES "support_access_events"("id"),
  "token" text NOT NULL UNIQUE,
  "reason" text DEFAULT '' NOT NULL,
  "expires_at" timestamp with time zone NOT NULL,
  "ended_at" timestamp with time zone,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "platform_support_sessions_staff" ON "platform_support_sessions" ("staff_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "platform_support_sessions_org" ON "platform_support_sessions" ("organisation_id");
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "organisation_support_notes" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "organisation_id" uuid NOT NULL REFERENCES "organisations"("id"),
  "staff_id" uuid REFERENCES "platform_staff"("id"),
  "body" text NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "organisation_support_notes_org" ON "organisation_support_notes" ("organisation_id");
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "feature_flags" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "key" text NOT NULL,
  "description" text DEFAULT '' NOT NULL,
  "enabled" boolean DEFAULT false NOT NULL,
  "organisation_id" uuid REFERENCES "organisations"("id"),
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint

CREATE UNIQUE INDEX IF NOT EXISTS "feature_flags_key_org" ON "feature_flags" ("key", "organisation_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "feature_flags_org" ON "feature_flags" ("organisation_id");
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "announcements" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "title" text NOT NULL,
  "body" text NOT NULL,
  "severity" text DEFAULT 'info' NOT NULL,
  "starts_at" timestamp with time zone DEFAULT now() NOT NULL,
  "ends_at" timestamp with time zone,
  "audience" text DEFAULT 'all' NOT NULL,
  "created_by_staff_id" uuid REFERENCES "platform_staff"("id"),
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
