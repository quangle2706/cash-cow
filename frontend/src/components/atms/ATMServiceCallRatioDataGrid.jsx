import { useEffect, useState } from "react";
import { DataGrid } from '@mui/x-data-grid';
import { Alert, Box, Typography, TextField } from "@mui/material";
import apiClient from '../../api/client';

const columns = [
    {field: 'atm_model', headerName: "ATM Model", width: 150},
    {field: 'total_count', headerName: "Total Calls", width: 160, type: 'number'},
    {field: 'completed_count', headerName: "Completed", width: 160, type: 'number'},
    {field: 'failed_count', headerName: "Failed", width: 160, type: 'number'},
    {
        field: 'completion_failure_ratio',
        headerName: "Ratio",
        width: 200,
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
                <DataGrid loading={loading} rows={data} columns={columns} getRowId={(row) => row.atm_model} />
            </Box>
        </>
    )
}

export default ATMServiceCallRatioDataGrid;