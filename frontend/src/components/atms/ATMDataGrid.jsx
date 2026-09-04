import { useEffect, useState } from "react";
import { DataGrid } from '@mui/x-data-grid';
import { Alert, Box, LinearProgress, Typography, TextField, CircularProgress, 
    Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Stack
 } from "@mui/material";
import apiClient from '../../api/client';

function CashLevelCell({ value }) {
    const cashLevel = Math.min(Math.max(Number(value) || 0, 0), 100);
    const color = cashLevel < 30 ? '#ff2d2d' : cashLevel < 60 ? '#ed6c02' : '#12a019';

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                width: '100%',
                height: '100%',
            }}
        >
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
            <Typography variant="body2" sx={{ minWidth: 38, textAlign: 'right', fontSize: '0.8rem', }}>
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
    {field: 'branch_id', headerName: "Branch ID", width: 90, type: 'number'}
];

const STATUS_OPTIONS = ['Operational', 'Low-Cash', 'Maintenance', 'Offline'];

//local state variables for tracking table rows, loading status, and network errors
//to track the lifecycle of the async API request so the UI can render appropriately
// Update: onSuccess: a function passed down from Dashboard, called with a message string
// whenever this component successfully creates an ATMs
function ATMDataGrid({ onSuccess }) {
    const [atms, setATMs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [threshold, setThreshold] = useState(0);

    //add form and dialog
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedAtm, setSelectedAtm] = useState(null);
    const [formValues, setFormValues] = useState({
        serial_number: '',
        model: '',
        cash_level: '',
        branch_id: '',
        status: 'Low-Cash',
    });

    //pulling out of the useEffect hook so that it can be called again after a successful create, not
    //just once on mount
    //React effect hook that runs our async fetch 
    // useEffect(() => {
    //     //track the component mount status to prevent memory leaks via network request delays
    //     let isMounted = true;

    //pulls our robot fleet data from our backend
    async function fetchATMs() {
        setLoading(true);
        try {
            const response = await apiClient.get('/atms', 
                { params: { max_cash_level: threshold === '' ? undefined : Number(threshold) }}
            );
            setATMs(response.data);
            setError(null);
            //if (isMounted) setATMs(response.data);
        } catch {
            //if (isMounted) setError('Could not load fleet data');
            setError('Could not load data');
        } finally {
            //if (isMounted) setLoading(false);
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchATMs();
    }, [threshold]);

    // fetchATMs();
    const handleFieldChange = (field) => (event) => {
        setFormValues((prev) => ({ ...prev, [field]: event.target.value }))
    }

    const openCreateDialog = () => {
        setSelectedAtm(null);
        setFormValues({
            serial_number: '',
            model: '',
            cash_level: '',
            branch_id: '',
            status: 'Low-Cash',
        });
        setDialogOpen(true);
    };

    const handleRowClick = ({ row }) => {
        setSelectedAtm(row);
        setFormValues({
            serial_number: row.serial_number,
            model: row.model,
            cash_level: row.cash_level,
            branch_id: row.branch_id,
            status: row.status,
        });
        setDialogOpen(true);
    };


    //handles the actual creation of a new robot record in the db
    const handleCreate = async() => {
        try {
            await apiClient.post('/atms', {
                ...formValues,
                cash_level: Number(formValues.cash_level),
                branch_id: Number(formValues.branch_id),
            });
            setDialogOpen(false);
            setFormValues({
                serial_number: '',
                model: '',
                cash_level: '',
                branch_id: '',
                status: 'Low-Cash',
            });
            await fetchATMs(); //see the table data refreshed with the new robot
            onSuccess?.(`ATM ${formValues.serial_number} created.`);
        } catch {
            //a real app would surface this inline in the dialog
        }
    }

    const handleUpdate = async () => {
        try {
            await apiClient.patch(`/atms/${selectedAtm.id}`, {
                ...formValues,
                cash_level: Number(formValues.cash_level),
                branch_id: Number(formValues.branch_id),
            });
            setDialogOpen(false);
            setSelectedAtm(null);
            await fetchATMs();
            onSuccess?.(`ATM ${formValues.serial_number} updated.`);
        } catch {
            setError('Could not update ATM');
        }
    };

    const handleDelete = async () => {
        if (!window.confirm(`Delete ATM ${selectedAtm.serial_number}?`)) return;

        try {
            await apiClient.delete(`/atms/${selectedAtm.id}`);
            setDialogOpen(false);
            setSelectedAtm(null);
            await fetchATMs();
            onSuccess?.(`ATM ${selectedAtm.serial_number} deleted.`);
        } catch {
            setError('Could not delete ATM');
        }
    };

    //shows a spinning progress indicator if loading data
    if (loading) return <CircularProgress />

    //shows an error if API call fails
    if (error) return <Alert severity="error">{error}</Alert>

    //returns our data grid if all succeeds
    return (
        <>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontSize: '0.8rem' }}>
                    Cash Level Threshold (%)
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
                <DataGrid
                    loading={loading}
                    rows={atms}
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
            <Button variant="outlined" sx={{ mb: 2, mt: 2 }} onClick={openCreateDialog}>Add ATM</Button>
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                <DialogTitle sx={{ color: 'black', textAlign: 'center' }}>
                    {selectedAtm ? 'Edit ATM' : 'Add New ATM'}
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 1, minWidth: 300 }}>
                        <TextField label="Serial Number" value={formValues.serial_number} onChange={handleFieldChange('serial_number')} />
                        <TextField label="Model" value={formValues.model} onChange={handleFieldChange('model')} />
                        <TextField label="Cash Level" type="number" value={formValues.cash_level} onChange={handleFieldChange('cash_level')} />
                        <TextField label="Branch ID" type="number" value={formValues.branch_id} onChange={handleFieldChange('branch_id')} />
                        <TextField select label="Status" value={formValues.status} onChange={handleFieldChange('status')}>
                            {STATUS_OPTIONS.map((option) => (
                                <MenuItem key={option} value={option}>{option}</MenuItem>
                            ))}
                        </TextField>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                    {selectedAtm && (
                        <Button color="error" onClick={handleDelete}>Delete</Button>
                    )}
                    <Button
                        variant="contained"
                        onClick={selectedAtm ? handleUpdate : handleCreate}
                    >
                        {selectedAtm ? 'Save changes' : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default ATMDataGrid;

// Using DataGrid -> we're not gonna use Card/List temporarily