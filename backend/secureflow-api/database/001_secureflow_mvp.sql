BEGIN;

ALTER TABLE workflow_requests
    ADD COLUMN IF NOT EXISTS assigned_employee_id BIGINT;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'fk_workflow_requests_assigned_employee'
    ) THEN
        ALTER TABLE workflow_requests
            ADD CONSTRAINT fk_workflow_requests_assigned_employee
            FOREIGN KEY (assigned_employee_id)
            REFERENCES users(user_id)
            ON DELETE SET NULL;
    END IF;
END
$$;

CREATE INDEX IF NOT EXISTS idx_workflow_requests_assigned_employee
    ON workflow_requests (assigned_employee_id);

CREATE INDEX IF NOT EXISTS idx_workflow_requests_assigned_manager
    ON workflow_requests (assigned_manager_id);

CREATE INDEX IF NOT EXISTS idx_workflow_requests_current_status
    ON workflow_requests (current_status);

CREATE INDEX IF NOT EXISTS idx_workflow_requests_employee_status
    ON workflow_requests (assigned_employee_id, current_status);

CREATE INDEX IF NOT EXISTS idx_workflow_requests_manager_status
    ON workflow_requests (assigned_manager_id, current_status);

CREATE INDEX IF NOT EXISTS idx_workflow_requests_creator_submitted
    ON workflow_requests (created_by_user_id, submitted_at DESC);

COMMIT;
