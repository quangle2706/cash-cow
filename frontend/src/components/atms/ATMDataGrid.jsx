import { useEffect, useState } from "react";
import { DataGrid } from '@mui/x-data-grid';
import { Alert, Box, LinearProgress, Typography, TextField } from "@mui/material";
import apiClient from '../../api/client';

function CashLevelCell({ value }) {
    const cashLevel = Math.min(Math.max(Number(value) || 0, 0), 100);
    const color = cashLevel < 30 ? '#ff2d2d' : cashLevel < 60 ? '#ed6c02' : '#12a019';

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
            <LinearProgress
                variant="determinate"
                value={cashLevel}
                aria-label={`Cash level ${cashLevel}%`}
                sx={{
                    flex: 1,
                    height: 5,
                    borderRadius: 4,
                    backgroundColor: 'action.hover',
                    '& .MuiLinearProgress-bar': {
                        backgroundColor: color,
                        borderRadius: 4,
                    },
                }}
            />
            <Typography variant="body2" sx={{ minWidth: 38, textAlign: 'right' }}>
                {cashLevel}%
            </Typography>
        </Box>
    );
}

//define our DataGrid columns and map them to our backend API response data
const columns = [
    {field: 'id', headerName: 'ID', width: 70}, // default type is String
    {field: 'serial_number', headerName: "Serial Number", width: 150},
    {field: 'model', headerName: "Model", width: 160},
    {field: 'cash_level', headerName: "Cash %", width: 250, type: 'number', renderCell: (params) => <CashLevelCell value={params.value} />},
    {field: 'status', headerName: "Status", width: 130},
    {field: 'branch_id', headerName: "Branch ID", width: 110, type: 'number'}
];

//local state variables for tracking table rows, loading status, and network errors
//to track the lifecycle of the async API request so the UI can render appropriately
function ATMDataGrid() {
    const [atms, setATMs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [threshold, setThreshold] = useState(20);

    //React effect hook that runs our async fetch 
    useEffect(() => {
        //track the component mount status to prevent memory leaks via network request delays
        let isMounted = true;

        //pulls our robot fleet data from our backend
        async function fetchATMs() {
            try {
                setLoading(true);
                setError(null);
                const response = await apiClient.get('/atms', 
                    { params: { max_cash_level: threshold === '' ? undefined : Number(threshold) }}
                );
                if (isMounted) setATMs(response.data);
            } catch {
                if (isMounted) setError('Could not load fleet data');
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        fetchATMs();
        return () => {
            isMounted = false;
        };
    }, [threshold]);

    //shows an error if API call fails
    if (error) return <Alert severity="error">{error}</Alert>

    //returns our data grid if all succeeds
    return (
        <>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Cash Level Threshold
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
            <Box sx={{height: 400, width: '100%'}}>
                <DataGrid loading={loading} rows={atms} columns={columns} getRowId={(row) => row.id} />
            </Box>
        </>
    )
}

export default ATMDataGrid;

// Using DataGrid -> we're not gonna use Card/List temporarily