--CashCow - Schema with PostgreSQL
--psql -U postgres -d cashcow_dev;
--\i schema.sql

--Enums
CREATE TYPE atm_status AS ENUM('Operational', 'Low-Cash', 'Maintenance', 'Offline');
CREATE TYPE service_call_priority AS ENUM('Low', 'Medium', 'Critical');
CREATE TYPE service_call_status AS ENUM('Pending', 'In-Progress', 'Completed', 'Failed');

--Branches Table
CREATE TABLE branches (
    id SERIAL PRIMARY KEY, --auto-incrementing integer that Postgres will assign for us
    name VARCHAR(100) NOT NULL, --name may be reserved
    location_region VARCHAR(50) NOT NULL,
    capacity INTEGER NOT NULL,
    supervisor_id INTEGER NOT NULL
);

--Technicians Table
CREATE TABLE technicians (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    branch_id INTEGER NOT NULL REFERENCES branches(id) --FOREIGN KEY: every technician belongs to exactly one branch
);

--ATMs table
CREATE TABLE atms (
    id SERIAL PRIMARY KEY,
    serial_number VARCHAR(50) NOT NULL UNIQUE, --UNIQUE: the database now enforces the 'no two robots share a serial number' as a rule
    model VARCHAR(100) NOT NULL,
    status atm_status NOT NULL DEFAULT 'Operational', --same as with vanilla python
    cash_level NUMERIC(5, 2) NOT NULL CHECK (cash_level BETWEEN 0 AND 100), --CHECK constraint is the database-level version of Day 1's robot _validate_battery()
    branch_id INTEGER NOT NULL REFERENCES branches(id)
);

--Service Calls table
CREATE TABLE service_calls (
    id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    priority service_call_priority NOT NULL,
    status service_call_status NOT NULL DEFAULT 'Pending',
    atm_id INTEGER NOT NULL REFERENCES atms(id),
    technician_id INTEGER NOT NULL REFERENCES technicians(id)
);

--Diagnostic reports table
CREATE TABLE diagnostic_reports (
    id SERIAL PRIMARY KEY,
    service_call_id INTEGER NOT NULL REFERENCES service_calls(id),
    file_url TEXT NOT NULL, --TEXT: has no length cap, unlike VARCHAR, s3 bucket urls can be quite long
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW() --NOW() is re-evaluated at every INSERT
);