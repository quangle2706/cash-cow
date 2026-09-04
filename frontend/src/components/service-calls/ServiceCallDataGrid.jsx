import { useEffect, useState } from "react";
import { DataGrid } from '@mui/x-data-grid';
import { Alert, Box, LinearProgress, Typography, TextField, CircularProgress, 
    Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Stack
 } from "@mui/material";
import apiClient from '../../api/client';

//define our DataGrid columns and map them to our backend API response data
const columns = [
    {field: 'id', headerName: 'ID', width: 70}, // default type is String
    {field: 'title', headerName: "Title", width: 180},
    {field: 'priority', headerName: "Priority", width: 130},
    {field: 'status', headerName: "Status", width: 130},
    {field: 'atm_id', headerName: "ATM ID", width: 90, type: 'number'},
    {field: 'technician_id', headerName: "Technician ID", width: 130, type: 'number'},
];

const PRIORITY_OPTIONS = ['Low', 'Medium', 'Critical'];
const STATUS_OPTIONS = ['Pending', 'In-Progress', 'Completed', 'Failed'];

//local state variables for tracking table rows, loading status, and network errors
//to track the lifecycle of the async API request so the UI can render appropriately
// Update: onSuccess: a function passed down from Dashboard, called with a message string
// whenever this component successfully creates an ATMs
function ServiceCallDataGrid({ onSuccess }) {
    const [serviceCalls, setServiceCalls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    //add form and dialog
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedServiceCall, setSelectedServiceCall] = useState(null);
    const [formValues, setFormValues] = useState({
        title: '',
        priority: '',
        status: '',
        atm_id: '',
        technician_id: '',
    });

    //pulling out of the useEffect hook so that it can be called again after a successful create, not
    //just once on mount
    //React effect hook that runs our async fetch 
    // useEffect(() => {
    //     //track the component mount status to prevent memory leaks via network request delays
    //     let isMounted = true;

        //pulls our robot fleet data from our backend
        async function fetchServiceCalls() {
            setLoading(true);
            try {
                const response = await apiClient.get('/service-calls');
                setServiceCalls(response.data);
                setError(null);
            } catch {
                setError('Could not load data');
            } finally {
                setLoading(false);
            }
        }

    const openCreateDialog = () => {
        setSelectedServiceCall(null);
        setFormValues({ title: '', priority: '', status: '', atm_id: '', technician_id: '' });
        setDialogOpen(true);
    };

    const handleRowClick = ({ row }) => {
        setSelectedServiceCall(row);
        setFormValues({
            title: row.title,
            priority: row.priority,
            status: row.status,
            atm_id: row.atm_id,
            technician_id: row.technician_id,
        });
        setDialogOpen(true);
    };

        useEffect(() => {
            fetchServiceCalls();
        }, []);

        const handleFieldChange = (field) => (event) => {
            setFormValues((prev) => ({ ...prev, [field]: event.target.value }))
        }


    //handles the actual creation of a new robot record in the db
    const handleCreate = async() => {
        try {
            await apiClient.post('/service-calls', {
                ...formValues
            });
            setDialogOpen(false);
            setFormValues({
                title: '',
                priority: '',
                status: '',
                atm_id: '',
                technician_id: '',
            });
            await fetchServiceCalls(); //see the table data refreshed with the new service call
            onSuccess?.(`Service Call ${formValues.title} created.`);
        } catch {
            //a real app would surface this inline in the dialog
        }
    }

    const handleUpdate = async () => {
        try {
            await apiClient.patch(`/service-calls/${selectedServiceCall.id}`, {
                ...formValues,
                atm_id: Number(formValues.atm_id),
                technician_id: Number(formValues.technician_id),
            });
            setDialogOpen(false);
            setSelectedServiceCall(null);
            await fetchServiceCalls();
            onSuccess?.(`Service Call ${formValues.title} updated.`);
        } catch {
            setError('Could not update service call');
        }
    };

    const handleDelete = async () => {
        if (!window.confirm(`Delete service call ${selectedServiceCall.title}?`)) return;
        try {
            await apiClient.delete(`/service-calls/${selectedServiceCall.id}`);
            setDialogOpen(false);
            setSelectedServiceCall(null);
            await fetchServiceCalls();
            onSuccess?.(`Service Call ${selectedServiceCall.title} deleted.`);
        } catch {
            setError('Could not delete service call');
        }
    };

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
                    rows={serviceCalls}
                    columns={columns}
                    getRowId={(row) => row.id}
                    onRowClick={handleRowClick}
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
            <Button variant="outlined" sx={{ mb: 2, mt: 2 }} onClick={openCreateDialog}>Add Service Call</Button>
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                <DialogTitle sx={{ color: 'black', textAlign: 'center' }}>{selectedServiceCall ? 'Edit Service Call' : 'Add New Service Call'}</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 1, minWidth: 300 }}>
                        <TextField label="Title" value={formValues.title} onChange={handleFieldChange('title')} />
                        <TextField label="Priority" select value={formValues.priority} onChange={handleFieldChange('priority')}>
                            {PRIORITY_OPTIONS.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField label="Status" select value={formValues.status} onChange={handleFieldChange('status')}>
                            {STATUS_OPTIONS.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField label="ATM ID" type="number" value={formValues.atm_id} onChange={handleFieldChange('atm_id')} />
                        <TextField label="Technician ID" type="number" value={formValues.technician_id} onChange={handleFieldChange('technician_id')} />

                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                    {selectedServiceCall && <Button color="error" onClick={handleDelete}>Delete</Button>}
                    <Button variant="contained" onClick={selectedServiceCall ? handleUpdate : handleCreate}>
                        {selectedServiceCall ? 'Save changes' : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default ServiceCallDataGrid;
