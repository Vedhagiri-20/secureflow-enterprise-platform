BEGIN;

ALTER TABLE workflow_requests
    ADD COLUMN IF NOT EXISTS applicant_first_name VARCHAR(100),
    ADD COLUMN IF NOT EXISTS applicant_middle_name VARCHAR(100),
    ADD COLUMN IF NOT EXISTS applicant_last_name VARCHAR(100),
    ADD COLUMN IF NOT EXISTS date_of_birth DATE,
    ADD COLUMN IF NOT EXISTS citizenship_status VARCHAR(80),
    ADD COLUMN IF NOT EXISTS requested_term_months INTEGER,
    ADD COLUMN IF NOT EXISTS employer_name VARCHAR(180),
    ADD COLUMN IF NOT EXISTS job_title VARCHAR(150),
    ADD COLUMN IF NOT EXISTS annual_gross_income NUMERIC(15, 2),
    ADD COLUMN IF NOT EXISTS address_line_1 VARCHAR(255),
    ADD COLUMN IF NOT EXISTS address_line_2 VARCHAR(255),
    ADD COLUMN IF NOT EXISTS city VARCHAR(120),
    ADD COLUMN IF NOT EXISTS state_province VARCHAR(120),
    ADD COLUMN IF NOT EXISTS postal_code VARCHAR(30),
    ADD COLUMN IF NOT EXISTS country_code VARCHAR(10),
    ADD COLUMN IF NOT EXISTS housing_status VARCHAR(80),
    ADD COLUMN IF NOT EXISTS monthly_housing_payment NUMERIC(15, 2);

CREATE INDEX IF NOT EXISTS idx_workflow_requests_postal_code
    ON workflow_requests (postal_code);

CREATE INDEX IF NOT EXISTS idx_workflow_requests_country_code
    ON workflow_requests (country_code);

COMMIT;
