import { useEffect, useState } from "react";
import { DataGrid } from '@mui/x-data-grid';
import { Alert, Box, LinearProgress, Typography, TextField, CircularProgress, 
    Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Stack
 } from "@mui/material";
import apiClient from '../../api/client';

//define our DataGrid columns and map them to our backend API response data
const columns = [
    {field: 'id', headerName: 'ID', width: 70}, // default type is String
    {field: 'name', headerName: "Branch Name", width: 180},
    {field: 'location_region', headerName: "Location Region", width: 250},
    {field: 'capacity', headerName: "Capacity", width: 130, type: 'number'},
    {field: 'supervisor_id', headerName: "Supervisor ID", width: 130, type: 'number'},
];


//local state variables for tracking table rows, loading status, and network errors
//to track the lifecycle of the async API request so the UI can render appropriately
// Update: onSuccess: a function passed down from Dashboard, called with a message string
// whenever this component successfully creates an ATMs
function BranchDataGrid({ onSuccess }) {
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    //add form and dialog
    const [dialogOpen, setDialogOpen] = useState(false);
    const [formValues, setFormValues] = useState({
        name: '',
        location_region: '',
        capacity: '',
        supervisor_id: '',
    });

    //pulling out of the useEffect hook so that it can be called again after a successful create, not
    //just once on mount
    //React effect hook that runs our async fetch 
    // useEffect(() => {
    //     //track the component mount status to prevent memory leaks via network request delays
    //     let isMounted = true;

        //pulls our robot fleet data from our backend
        async function fetchBranches() {
            setLoading(true);
            try {
                const response = await apiClient.get('/branches');

                setBranches(response.data);
                setError(null);
                //if (isMounted) setBranches(response.data);
            } catch {
                //if (isMounted) setError('Could not load fleet data');
                setError('Could not load data');
            } finally {
                //if (isMounted) setLoading(false);
                setLoading(false);
            }
        }

        useEffect(() => {
            fetchBranches();
        }, []);

        // fetchBranches();
        const handleFieldChange = (field) => (event) => {
            setFormValues((prev) => ({ ...prev, [field]: event.target.value }))
        }


    //handles the actual creation of a new robot record in the db
    const handleCreate = async() => {
        try {
            await apiClient.post('/branches', {
                ...formValues
            });
            setDialogOpen(false);
            setFormValues({
                name: '',
                location_region: '',
                capacity: '',
                supervisor_id: '',
            });
            await fetchBranches(); //see the table data refreshed with the new branch
            onSuccess?.(`Branch ${formValues.name} created.`);
        } catch {
            //a real app would surface this inline in the dialog
        }
    }

    //shows a spinning progress indicator if loading data
    if (loading) return <CircularProgress />

    //shows an error if API call fails
    if (error) return <Alert severity="error">{error}</Alert>

    //returns our data grid if all succeeds
    return (
        <>
            <Box sx={{ height: 400, width: '100%' }}>
                <DataGrid
                    loading={loading}
                    rows={branches}
                    columns={columns}
                    getRowId={(row) => row.id}
                    rowHeight={44}
                    columnHeaderHeight={45}
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
            <Button variant="outlined" sx={{ mb: 2, mt: 2 }} onClick={() => setDialogOpen(true)}>Add Branch</Button>
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                <DialogTitle sx={{ color: 'black', textAlign: 'center' }} >Add New Branch</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 1, minWidth: 300 }}>
                        <TextField label="Name" value={formValues.name} onChange={handleFieldChange('name')} />
                        <TextField label="Location Region" value={formValues.location_region} onChange={handleFieldChange('location_region')} />
                        <TextField label="Capacity" type="number" value={formValues.capacity} onChange={handleFieldChange('capacity')} />
                        <TextField label="Supervisor ID" type="number" value={formValues.supervisor_id} onChange={handleFieldChange('supervisor_id')} />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleCreate}>Create</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default BranchDataGrid;
