BEGIN;

ALTER TABLE users
    ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP;

ALTER TABLE users
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMP
    NOT NULL DEFAULT CURRENT_TIMESTAMP;

DO $$
DECLARE
    identity_flag TEXT;
    current_default TEXT;
BEGIN
    SELECT
        is_identity,
        column_default
    INTO
        identity_flag,
        current_default
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'users'
      AND column_name = 'user_id';

    IF identity_flag = 'NO'
       AND current_default IS NULL THEN

        CREATE SEQUENCE IF NOT EXISTS users_user_id_seq;

        PERFORM setval(
            'users_user_id_seq',
            GREATEST(
                COALESCE(
                    (
                        SELECT MAX(user_id)
                        FROM users
                    ),
                    0
                ) + 1,
                1
            ),
            false
        );

        ALTER TABLE users
            ALTER COLUMN user_id
            SET DEFAULT nextval('users_user_id_seq');

        ALTER SEQUENCE users_user_id_seq
            OWNED BY users.user_id;
    END IF;
END
$$;

CREATE TABLE IF NOT EXISTS audit_events (
    audit_event_id BIGSERIAL PRIMARY KEY,
    actor_email VARCHAR(255) NOT NULL,
    actor_role VARCHAR(50) NOT NULL,
    action VARCHAR(100) NOT NULL,
    details VARCHAR(1000),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_events_email
    ON audit_events(actor_email);

CREATE INDEX IF NOT EXISTS idx_audit_events_action
    ON audit_events(action);

CREATE INDEX IF NOT EXISTS idx_audit_events_created_at
    ON audit_events(created_at DESC);

COMMIT;
