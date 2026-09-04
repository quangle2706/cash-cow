import { useEffect, useState } from "react";
import { DataGrid } from '@mui/x-data-grid';
import { Alert, Box, LinearProgress, Typography, TextField, CircularProgress, 
    Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Stack
 } from "@mui/material";
import apiClient from '../../api/client';

//define our DataGrid columns and map them to our backend API response data
const columns = [
    {field: 'id', headerName: 'ID', width: 70}, // default type is String
    {field: 'service_call_id', headerName: "Service Call ID", width: 120, type: 'number'},
    {
        field: 'file_url',
        headerName: "File URL",
        width: 310,
        renderCell: ({ value }) => (
            <a href={value} target="_blank">
                OPEN LINK FILE
            </a>
        ),
    },
    {field: 'notes', headerName: "Notes", width: 310},
];


//local state variables for tracking table rows, loading status, and network errors
//to track the lifecycle of the async API request so the UI can render appropriately
// Update: onSuccess: a function passed down from Dashboard, called with a message string
// whenever this component successfully creates an ATMs
function DiagnosticReportDataGrid({ onSuccess }) {
    const [diagnosticReports, setDiagnosticReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    //add form and dialog
    const [dialogOpen, setDialogOpen] = useState(false);
    const [formValues, setFormValues] = useState({
        service_call_id: '',
        notes: '',
    });
    const [selectedFile, setSelectedFile] = useState(null);

    //pulling out of the useEffect hook so that it can be called again after a successful create, not
    //just once on mount
    //React effect hook that runs our async fetch 
    // useEffect(() => {
    //     //track the component mount status to prevent memory leaks via network request delays
    //     let isMounted = true;

        //pulls our robot fleet data from our backend
        async function fetchDiagnosticReports() {
            setLoading(true);
            try {
                const response = await apiClient.get('/diagnostic-reports');

                setDiagnosticReports(response.data);
                setError(null);
                //if (isMounted) setDiagnosticReports(response.data);
            } catch {
                //if (isMounted) setError('Could not load fleet data');
                setError('Could not load data');
            } finally {
                //if (isMounted) setLoading(false);
                setLoading(false);
            }
        }

        useEffect(() => {
            fetchDiagnosticReports();
        }, []);

        const handleFieldChange = (field) => (event) => {
            setFormValues((prev) => ({ ...prev, [field]: event.target.value }))
        }


    //handles the actual creation of a new robot record in the db
    const handleCreate = async() => {
        if (!selectedFile) return;

        try {
            const payload = new FormData();
            payload.append('service_call_id', formValues.service_call_id);
            payload.append('note', formValues.notes);
            payload.append('file', selectedFile);

            await apiClient.post('/diagnostic-reports', payload);
            setDialogOpen(false);
            setFormValues({ service_call_id: '', notes: '' });
            setSelectedFile(null);
            await fetchDiagnosticReports();
            onSuccess?.(`Diagnostic report created.`);
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
                    rows={diagnosticReports}
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
            <Button variant="outlined" sx={{ mb: 2, mt: 2 }} onClick={() => setDialogOpen(true)}>Add Diagnostic Report</Button>
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                <DialogTitle sx={{ color: 'black', textAlign: 'center' }} >Add New Diagnostic Report</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 1, minWidth: 300 }}>
                        <TextField label="Service Call ID" type="number" value={formValues.service_call_id} onChange={handleFieldChange('service_call_id')} />
                        <Button component="label" variant="outlined">
                            {selectedFile ? selectedFile.name : 'Choose file'}
                            <input
                                type="file"
                                hidden
                                onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)}
                            />
                        </Button>
                        <TextField label="Notes" value={formValues.notes} onChange={handleFieldChange('notes')} />
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

export default DiagnosticReportDataGrid;
