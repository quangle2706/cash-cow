-- ============================================================
-- CASH COW - SEED DATA
-- ============================================================


-- ============================================================
-- 1. BRANCHES - 5
-- ============================================================

INSERT INTO branches (name, location_region, capacity, supervisor_id) VALUES
    ('Downtown Branch', 'North', 20, 101),      -- id 1
    ('Riverside Branch', 'South', 15, 102),     -- id 2
    ('Midtown Branch', 'Central', 25, 103),     -- id 3
    ('Airport Branch', 'South', 30, 102),       -- id 4
    ('Lakeside Branch', 'North', 18, 101);      -- id 5


-- ============================================================
-- 2. TECHNICIANS - 8
-- ============================================================

INSERT INTO technicians (name, branch_id) VALUES
    ('John Smith', 1),          -- id 1
    ('Emily Davis', 1),         -- id 2
    ('Michael Brown', 2),       -- id 3
    ('Sarah Wilson', 2),        -- id 4
    ('David Martinez', 3),      -- id 5
    ('Jessica Taylor', 4),      -- id 6
    ('Robert Anderson', 4),     -- id 7
    ('Amanda White', 5);        -- id 8


-- ============================================================
-- 3. ATMS - 10
-- ============================================================

INSERT INTO atms
    (serial_number, model, status, cash_level, branch_id)
VALUES
    -- Branch 1
    ('ATM-10001', 'NCR SelfServ 80', 'Operational', 85.50, 1),               
    ('ATM-10002', 'Diebold Nixdorf DN200', 'Low-Cash', 15.25, 1),                  
    -- Branch 2
    ('ATM-20001', 'Hyosung MX8800', 'Maintenance', 65.00, 2),              
    ('ATM-20002', 'NCR SelfServ 80', 'Operational', 72.00, 2),             
    -- Branch 3
    ('ATM-30001', 'Diebold Nixdorf DN200', 'Operational', 91.00, 3),              
    ('ATM-30002', 'Hyosung MX8800', 'Maintenance', 42.50, 3),             
    -- Branch 4
    ('ATM-40001', 'NCR SelfServ 80', 'Maintenance', 56.00, 4),             
    ('ATM-40002', 'Diebold Nixdorf DN200', 'Low-Cash', 9.50, 4),               
    -- Branch 5
    ('ATM-50001', 'Hyosung MX8800', 'Offline', 33.00, 5),                  
    ('ATM-50002', 'NCR SelfServ 80', 'Operational', 78.50, 5);             

-- ============================================================
-- 4. SERVICE CALLS - 12
-- ============================================================

INSERT INTO service_calls
    (title, priority, status, atm_id, technician_id)
VALUES
    ('Routine cash dispenser inspection', 'Low', 'Completed', 1, 1),
    ('Low cash level investigation', 'Medium', 'Pending', 2, 2),
    ('Card reader malfunction', 'Low', 'In-Progress', 3, 1),
    ('Network connectivity issue', 'Medium', 'Completed', 4, 3),
    ('Receipt printer replacement', 'Low', 'Completed', 5, 5),
    ('Hardware maintenance inspection', 'Critical', 'Pending', 6, 6),
    ('Cash dispenser failure', 'Critical', 'Failed', 7, 6),
    ('Cash replenishment request', 'Medium', 'In-Progress', 8, 7),
    ('ATM offline investigation', 'Medium', 'Failed', 9, 4),
    ('Software update', 'Low', 'Completed', 10, 8),
    ('Preventive maintenance', 'Medium', 'Completed', 3, 4),
    ('PIN pad security issue', 'Critical', 'Pending', 5, 8);

-- ============================================================
-- 5. DIAGNOSTIC REPORTS - 4
-- ============================================================

-- INSERT INTO diagnostic_reports
--     (service_call_id, file_url, notes)
-- VALUES
--     (1, 's3://diagnostic_reports/service-call-1.pdf', 'Routine inspection completed successfully.'),
--     (3, 's3://diagnostic_reports/service-call-3.pdf', 'Card reader malfunction detected during diagnostics.'),
--     (7, 's3://diagnostic_reports/service-call-7.pdf', 'Cash dispenser hardware failure confirmed.'),
--     (9, 's3://diagnostic_reports/service-call-9.pdf', 'ATM network and power diagnostics completed.');

-- ============================================================
-- 6. RESET AUTO-INCREMENT SEQUENCES
-- ============================================================

SELECT setval('branches_id_seq', (SELECT MAX(id) FROM branches));
SELECT setval('technicians_id_seq', (SELECT MAX(id) FROM technicians));
SELECT setval('atms_id_seq', (SELECT MAX(id) FROM atms));
SELECT setval('service_calls_id_seq', (SELECT MAX(id) FROM service_calls));
SELECT setval('diagnostic_reports_id_seq', (SELECT MAX(id) FROM diagnostic_reports));