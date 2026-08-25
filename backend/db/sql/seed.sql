--psql -U postgres -d cashcow_dev;
--\i seed.sql

-- ============================================================
-- 1. BRANCHES
-- ============================================================

INSERT INTO branches (name, location_region, capacity, supervisor_id) VALUES
    ('Downtown Branch', 'North', 20, 101),
    ('Riverside Branch', 'South', 15, 102);


-- ============================================================
-- 2. TECHNICIANS
-- ============================================================

INSERT INTO technicians (name, branch_id) VALUES
    ('John Smith', 1),
    ('Emily Davis', 1),
    ('Michael Brown', 2);

-- ============================================================
-- 3. ATMS
-- ============================================================

INSERT INTO atms (serial_number, model, status, cash_level, branch_id) VALUES
    ('ATM-10001', 'NCR SelfServ 80', 'Operational', 85.50, 1),
    ('ATM-10002', 'NCR SelfServ 80', 'Low-Cash',    15.25, 1),
    ('ATM-20001', 'Diebold Nixdorf DN200', 'Maintenance', 65.00, 2),
    ('ATM-30001', 'Hyosung MX8800', 'Offline',     45.00, 2);


-- ============================================================
-- 4. SERVICE CALLS
-- ============================================================

INSERT INTO service_calls (title, priority, status, atm_id, technician_id) VALUES
    ('Routine cash dispenser inspection', 'Low', 'Completed', 1, 1),
    ('Low cash level investigation', 'Medium', 'Pending', 2, 2),
    ('Network connectivity issue', 'Medium', 'Pending', 1, 3),
    ('Unexpected reboot detected', 'Critical', 'In-Progress', 3, 3);


-- ============================================================
-- 5. DIAGNOSTIC REPORTS
-- ============================================================

INSERT INTO diagnostic_reports (service_call_id, file_url, notes) VALUES
    (1, 's3://cashcow-diagnostics/service-call-1.pdf', 'Routine inspection completed successfully.');

--SELECT STATEMENTS AKA Queries
--setval to ensure that the next time we insert a new record into any of these tables, the id will be set to the next available integer, rather than starting over at 1. This is important because if we were to insert a new record without setting the sequence value, we would get a duplicate key error since the id would already exist in the table.
SELECT setval('branches_id_seq', (SELECT MAX(id) FROM branches)); 
SELECT setval('technicians_id_seq', (SELECT MAX(id) FROM technicians));
SELECT setval('atms_id_seq', (SELECT MAX(id) FROM atms));
SELECT setval('service_calls_id_seq', (SELECT MAX(id) FROM service_calls));