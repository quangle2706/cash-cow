// How many technicians reporting to a specific Regional Operations Supervisor 
// have active service calls assigned to them?
import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Alert, Box, CircularProgress, TextField, Typography } from "@mui/material";
import apiClient from "../../api/client";

const columns = [
    { field: 'technician_name', headerName: 'Technician', width: 180 },
    { field: 'branch_name', headerName: 'Branch', width: 180 },
    { field: 'active_calls', headerName: 'Active Calls', width: 130, type: 'number' },
    { field: 'pending_calls', headerName: 'Pending', width: 110, type: 'number' },
    { field: 'in_progress_calls', headerName: 'In Progress', width: 130, type: 'number' },
    { field: 'supervisor_id', headerName: 'Supervisor ID', width: 110, type: 'number'},
];

function ActiveTechnicianDataGrid() {
    const [supervisorId, setSupervisorId] = useState("");
    const [activeTechsCount, setActiveTechsCount] = useState("");
    const [activeTechs, setActiveTechs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;
        const params = supervisorId === '' ? {} : { supervisor_id: Number(supervisorId) };

        async function fetchActiveTechnicians() {
            try {
                setLoading(true);
                setError(null);
                const [countResponse, listResponse] = await Promise.all([
                    apiClient.get('/technicians/active-service-calls', { params }),
                    apiClient.get('/technicians/active-service-calls-list', { params }),
                ]);
                if (isMounted) {
                    setActiveTechsCount(countResponse.data.active_technician_count);
                    setActiveTechs(listResponse.data);
                }
            } catch {
                if (isMounted) setError('Could not load active service calls');
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        fetchActiveTechnicians();
        return () => {
            isMounted = false;
        };
    }, [supervisorId]);

    return (
        <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <TextField
                    label="Supervisor ID"
                    type="number"
                    value={supervisorId}
                    onChange={(event) => setSupervisorId(event.target.value)}
                    size="small"
                    sx={{
                        width: 150,
                        '& .MuiInputBase-root': { height: 40 },
                        '& .MuiInputBase-input, & .MuiInputLabel-root': { fontSize: '0.8rem' },
                    }}
                />
                <Typography sx={{ fontSize: '0.8rem' }}>
                    Active technicians: {activeTechsCount}
                </Typography>
            </Box>

            {loading && <CircularProgress size={24} />}
            {error && <Alert severity="error">{error}</Alert>}
            {!loading && !error && (
                <Box sx={{ height: 400, width: '100%' }}>
                    <DataGrid
                        rows={activeTechs}
                        columns={columns}
                        getRowId={(row) => row.technician_id}
                        rowHeight={44}
                        columnHeaderHeight={42}
                        sx={{
                            '& .MuiDataGrid-cell': { fontSize: '0.8rem' },
                            '& .MuiDataGrid-columnHeaderTitle': {
                                fontSize: '0.8rem',
                                fontWeight: 700,
                            },
                        }}
                    />
                </Box>
            )}
        </Box>
    );

}

export default ActiveTechnicianDataGrid;