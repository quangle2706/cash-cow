import { useEffect, useState } from "react";
import { DataGrid } from '@mui/x-data-grid';
import { Alert, Box, Typography, TextField } from "@mui/material";
import apiClient from '../../api/client';

const columns = [
    {field: 'branch_id', headerName: "Branch ID", width: 150},
    {field: 'branch_name', headerName: "Branch Name", width: 220},
    {field: 'total_atms', headerName: "Total ATMs", width: 160, type: 'number'},
    {field: 'total_maintenance_atms', headerName: "Total Maintenance ATMs", width: 160, type: 'number'},
    {
        field: 'maintenance_ratio',
        headerName: "Maintenance Ratio",
        width: 200,
        align: 'right',
        headerAlign: 'right',
        renderCell: ({ value }) => value == null ? 'N/A' : value,
    }
]

function BranchMaintenanceDataGrid() {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [threshold, setThreshold] = useState(30);

    useEffect(() => {
        let isMounted = true;

        async function fetchData() {
            try {
                setLoading(true);
                setError(null);
                const response = await apiClient.get('/branches/maintenance-ratio', {
                    params: { threshold: threshold === '' ? undefined : Number(threshold) }
                });
                if (isMounted) setData(response.data);
            } catch {
                if (isMounted) setError('Could not load data');
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        fetchData();
        return () => {
            isMounted = false;
        }
    }, [threshold]);

    //shows an error if API call fails
    if (error) return <Alert severity="error">{error}</Alert>

    return (
        <>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Maintenance Threshold
                </Typography>

                <TextField
                    label="Minimum %"
                    type="number"
                    value={threshold}
                    onChange={(event) => setThreshold(event.target.value)}
                    size="small"
                    slotProps={{
                    htmlInput: {
                        min: 0,
                        max: 100,
                    },
                    }}
                    sx={{
                        width: 140,
                        '& .MuiInputBase-root': { height: 40 },
                    }}
                />
            </Box>
            <Box sx={{ height: 400, width: '100%' }}>
                <DataGrid loading={loading} rows={data} columns={columns} getRowId={(row) => row.branch_id} />
            </Box>
        </>
    )
}

export default BranchMaintenanceDataGrid;