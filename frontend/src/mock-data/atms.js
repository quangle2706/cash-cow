// INSERT INTO atms (serial_number, model, status, cash_level, branch_id) VALUES
//     ('ATM-10001', 'NCR SelfServ 80', 'Operational', 85.50, 1),
//     ('ATM-10002', 'NCR SelfServ 80', 'Low-Cash',    15.25, 1),
//     ('ATM-20001', 'Diebold Nixdorf DN200', 'Maintenance', 65.00, 2),
//     ('ATM-30001', 'Hyosung MX8800', 'Offline',     45.00, 2);

import { modalClasses } from "@mui/material";

export const mockATMs = [
    {id: 1, serialNumber: 'ATM-10001', model: 'NCR SelfServ 80', status: 'Operational', cashLevel: 85.50, branchId: 1},
    {id: 2, serialNumber: 'ATM-10002', model: 'NCR SelfServ 80', status: 'Low-Cash', cashLevel: 15.25, branchId: 1},
    {id: 3, serialNumber: 'ATM-20001', model: 'Diebold Nixdorf DN200', status: 'Maintenance', cashLevel: 65.00, branchId: 2},
    {id: 4, serialNumber: 'ATM-30001', model: 'Hyosung MX8800', status: 'Offline', cashLevel: 45.00, branchId: 2}
];