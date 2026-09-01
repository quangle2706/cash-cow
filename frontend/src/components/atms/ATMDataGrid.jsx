import { useEffect, useState } from "react";
import { DataGrid } from '@mui/x-data-grid';
import { Alert, Box, CircularProgress } from "@mui/material";
import apiClient from '../../api/client';

//define our DataGrid columns and map them to our backend API response data
const columns = [
    {field: 'id', headerName: 'ID', width: 70}, // default type is String
    {field: 'serial_number', headerName: "Serial Number", width: 150},
    {field: 'model', headerName: "Model", width: 160},
    {field: 'cash_level', headerName: "Cash %", width: 120, type: 'number'},
    {field: 'status', headerName: "Status", width: 130},
    {field: 'branch_id', headerName: "Branch ID", width: 110, type: 'number'}
];

//local state variables for tracking table rows, loading status, and network errors
//to track the lifecycle of the async API request so the UI can render appropriately
function ATMDataGrid() {
    const [atms, setATMs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    //React effect hook that runs our async fetch 
    useEffect(() => {
        //track the component mount status to prevent memory leaks via network request delays
        let isMounted = true;

        //pulls our robot fleet data from our backend
        async function fetchATMs() {
            try {
                const response = await apiClient.get('/atms');
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
    }, []);

    //shows a spinning progress indicator if loading data
    if (loading) return <CircularProgress />

    //shows an error if API call fails
    if (error) return <Alert severity="error">{error}</Alert>

    //returns our data grid if all succeeds
    return (
        <Box sx={{height: 400, width: '100%'}}>
            <DataGrid rows={atms} columns={columns} getRowId={(row) => row.id} />
        </Box>
    )
}

export default ATMDataGrid;

// Using DataGrid -> we're not gonna use Card/List temporarily