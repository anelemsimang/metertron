-- One free trial per email (signup). Paid access is activated by platform staff.
CREATE TABLE IF NOT EXISTS trial_claims (
  email text PRIMARY KEY,
  organisation_id uuid REFERENCES organisations (id),
  claimed_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS trial_claims_org ON trial_claims (organisation_id);
