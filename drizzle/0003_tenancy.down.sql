-- Reverse Phase 2 tenancy / RLS migration.

DROP POLICY IF EXISTS export_templates_isolation ON export_templates;
DROP POLICY IF EXISTS export_runs_isolation ON export_runs;
DROP POLICY IF EXISTS stock_movements_isolation ON stock_movements;
DROP POLICY IF EXISTS stock_items_isolation ON stock_items;
DROP POLICY IF EXISTS audit_events_isolation ON audit_events;
DROP POLICY IF EXISTS quality_flags_isolation ON quality_flags;
DROP POLICY IF EXISTS job_photos_isolation ON job_photos;
DROP POLICY IF EXISTS job_faults_isolation ON job_faults;
DROP POLICY IF EXISTS jobs_isolation ON jobs;
DROP POLICY IF EXISTS work_orders_isolation ON work_orders;
DROP POLICY IF EXISTS form_versions_isolation ON form_versions;
DROP POLICY IF EXISTS meter_types_isolation ON meter_types;
DROP POLICY IF EXISTS meter_classes_isolation ON meter_classes;
DROP POLICY IF EXISTS meter_sizes_isolation ON meter_sizes;
DROP POLICY IF EXISTS installers_isolation ON installers;
DROP POLICY IF EXISTS towns_isolation ON towns;
DROP POLICY IF EXISTS contract_grants_isolation ON contract_grants;
DROP POLICY IF EXISTS contracts_isolation ON contracts;
DROP POLICY IF EXISTS sessions_isolation ON sessions;
DROP POLICY IF EXISTS users_isolation ON users;
DROP POLICY IF EXISTS organisation_memberships_isolation ON organisation_memberships;
DROP POLICY IF EXISTS organisations_isolation ON organisations;

ALTER TABLE IF EXISTS export_templates DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS export_runs DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS stock_movements DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS stock_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS audit_events DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS quality_flags DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS job_photos DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS job_faults DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS jobs DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS work_orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS form_versions DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS meter_types DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS meter_classes DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS meter_sizes DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS installers DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS towns DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS contract_grants DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS contracts DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS users DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS organisation_memberships DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS organisations DISABLE ROW LEVEL SECURITY;

DROP TABLE IF EXISTS export_templates;
DROP TABLE IF EXISTS organisation_memberships;

DROP FUNCTION IF EXISTS app_org_id();
DROP FUNCTION IF EXISTS app_rls_bypass();

DROP TYPE IF EXISTS membership_role;
DROP TYPE IF EXISTS org_status;

-- Column drops left intentional: removing NOT NULL organisation_id from children may fail if still populated.
-- Re-run a full restore from backup for a complete rollback of data shape.
