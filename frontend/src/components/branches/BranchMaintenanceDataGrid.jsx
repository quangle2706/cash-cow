import { useEffect, useState } from "react";
import { DataGrid } from '@mui/x-data-grid';
import { Alert, Box, Typography, TextField } from "@mui/material";
import apiClient from '../../api/client';

const columns = [
    {field: 'branch_id', headerName: "Branch ID", width: 90},
    {field: 'branch_name', headerName: "Branch Name", width: 180},
    {field: 'total_atms', headerName: "Total ATMs", width: 120, type: 'number'},
    {field: 'total_maintenance_atms', headerName: "Total Maintenance ATMs", width: 220, type: 'number'},
    {
        field: 'maintenance_ratio',
        headerName: "Maintenance Ratio",
        width: 160,
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
                <Typography variant="subtitle2" sx={{ fontSize: '0.8rem' }}>
                    Maintenance Threshold (%)
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
                        '& .MuiInputBase-input': { fontSize: '0.8rem' },
                        '& .MuiInputLabel-root': { fontSize: '0.9rem' },
                        '& input[type=number]': { colorScheme: 'light' },
                    }}
                />
            </Box>
            <Box sx={{ height: 400, width: '100%' }}>
                <DataGrid loading={loading} 
                    rows={data} columns={columns} 
                    getRowId={(row) => row.branch_id} 
                    sx={{
                        '& .MuiDataGrid-cell': {
                            fontSize: '0.8rem',
                            alignItems: 'center',
                        },
                        '& .MuiDataGrid-columnHeaderTitle': {
                            fontSize: '0.8rem',
                            fontWeight: 700,
                        },
                        '& .MuiDataGrid-columnHeaders': {
                            backgroundColor: '#f4f6f8',
                            borderBottom: '2px solid #d7dce2',
                        },
                    }}
                />
            </Box>
        </>
    )
}

export default BranchMaintenanceDataGrid;