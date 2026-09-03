import { useEffect, useState } from "react";
import { DataGrid } from '@mui/x-data-grid';
import { Alert, Box, Typography, TextField } from "@mui/material";
import apiClient from '../../api/client';

const columns = [
    {field: 'atm_model', headerName: "ATM Model", width: 230},
    {field: 'total_count', headerName: "Total Calls", width: 120, type: 'number'},
    {field: 'completed_count', headerName: "Completed", width: 120, type: 'number'},
    {field: 'failed_count', headerName: "Failed", width: 120, type: 'number'},
    {
        field: 'completion_failure_ratio',
        headerName: "Ratio",
        width: 180,
        align: 'right',
        headerAlign: 'right',
        renderCell: ({ value }) => value == null ? 'N/A' : value,
    }
]

function ATMServiceCallRatioDataGrid() {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        async function fetchData() {
            try {
                setLoading(true);
                setError(null);
                const response = await apiClient.get('/service-calls/completion-failure-ratio');
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
    }, []);

    //shows an error if API call fails
    if (error) return <Alert severity="error">{error}</Alert>

    return (
        <>
            <Box sx={{ height: 400, width: '100%' }}>
                <DataGrid loading={loading} 
                    rows={data} 
                    columns={columns} 
                    getRowId={(row) => row.atm_model} 
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

export default ATMServiceCallRatioDataGrid;