BEGIN;

CREATE TABLE IF NOT EXISTS workflow_events (
    event_id BIGSERIAL PRIMARY KEY,
    workflow_id BIGINT NOT NULL,
    status VARCHAR(50) NOT NULL,
    actor_email VARCHAR(255) NOT NULL,
    actor_role VARCHAR(50) NOT NULL,
    changed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_workflow_events_workflow
        FOREIGN KEY (workflow_id)
        REFERENCES workflow_requests(workflow_id)
        ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_workflow_events_workflow
    ON workflow_events (workflow_id);

CREATE INDEX IF NOT EXISTS idx_workflow_events_changed_at
    ON workflow_events (changed_at);

INSERT INTO workflow_events (
    workflow_id,
    status,
    actor_email,
    actor_role,
    changed_at
)
SELECT
    wr.workflow_id,
    wr.current_status,
    COALESCE(u.email, 'system@secureflow.local'),
    'SYSTEM',
    COALESCE(wr.updated_at, wr.submitted_at, CURRENT_TIMESTAMP)
FROM workflow_requests wr
LEFT JOIN users u
    ON u.user_id = wr.created_by_user_id
WHERE NOT EXISTS (
    SELECT 1
    FROM workflow_events we
    WHERE we.workflow_id = wr.workflow_id
);

COMMIT;
