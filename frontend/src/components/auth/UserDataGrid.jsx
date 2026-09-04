import { useEffect, useState } from "react";
import { DataGrid } from '@mui/x-data-grid';
import { Alert, Box, LinearProgress, Typography, TextField, CircularProgress, 
    Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Stack
 } from "@mui/material";
import apiClient from '../../api/client';

//define our DataGrid columns and map them to our backend API response data
const columns = [
    {field: 'id', headerName: 'ID', width: 70}, // default type is String
    {field: 'username', headerName: "Username", width: 250},
    {field: 'role', headerName: "Role", width: 250},
];

// OPERATIONS_ADMIN = "Operations Admin"
// FIELD_TECHNICIAN = "Field Technician"
// AUDITOR = "Auditor"
const ROLE_OPTIONS = ['Operations Admin', 'Field Technician', 'Auditor'];

function getApiErrorMessage(error, fallback) {
    const detail = error.response?.data?.detail;
    return Array.isArray(detail)
        ? detail.map((item) => item.msg).join(', ')
        : detail || fallback;
}

//local state variables for tracking table rows, loading status, and network errors
//to track the lifecycle of the async API request so the UI can render appropriately
// Update: onSuccess: a function passed down from Dashboard, called with a message string
// whenever this component successfully creates an ATMs
function UserDataGrid({ onSuccess, onError }) {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    //add form and dialog
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [formValues, setFormValues] = useState({
        username: '',
        password: '',
        role: '',
    });

    //pulls our robot fleet data from our backend
    async function fetchUsers() {
        setLoading(true);
        try {
            const response = await apiClient.get('/auth/users');

            setUsers(response.data);
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

    const openCreateDialog = () => {
        setSelectedUser(null);
        setFormValues({ username: '', password: '', role: '' });
        setDialogOpen(true);
    };

    const handleRowClick = ({ row }) => {
        setSelectedUser(row);
        setFormValues({ username: row.username, password: '', role: row.role });
        setDialogOpen(true);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleFieldChange = (field) => (event) => {
        setFormValues((prev) => ({ ...prev, [field]: event.target.value }))
    }


    //handles the actual creation of a new robot record in the db
    const handleCreate = async() => {
        try {
            await apiClient.post('/auth/register', {
                ...formValues
            });
            setDialogOpen(false);
            setFormValues({
                username: '',
                password: '',
                role: '',
            });
            await fetchUsers(); //see the table data refreshed with the new user
            onSuccess?.(`User ${formValues.username} created.`);
        } catch (error) {
            onError?.(getApiErrorMessage(error, 'Could not create user.'));
        }
    }

    const handleUpdate = async () => {
        try {
            const payload = { username: formValues.username, role: formValues.role };
            if (formValues.password) payload.password = formValues.password;
            await apiClient.patch(`/auth/users/${selectedUser.id}`, payload);
            setDialogOpen(false);
            setSelectedUser(null);
            await fetchUsers();
            onSuccess?.(`User ${formValues.username} updated.`);
        } catch (error) {
            onError?.(getApiErrorMessage(error, 'Could not update user.'));
        }
    };

    const handleDelete = async () => {
        if (!window.confirm(`Delete user ${selectedUser.username}?`)) return;
        try {
            await apiClient.delete(`/auth/users/${selectedUser.id}`);
            setDialogOpen(false);
            setSelectedUser(null);
            await fetchUsers();
            onSuccess?.(`User ${selectedUser.username} deleted.`);
        } catch (error) {
            onError?.(error.response?.data?.detail || 'Could not delete user.');
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
                    rows={users}
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
            <Button variant="outlined" sx={{ mb: 2, mt: 2 }} onClick={openCreateDialog}>Add User</Button>
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                <DialogTitle sx={{ color: 'black', textAlign: 'center' }}>{selectedUser ? 'Edit User' : 'Add New User'}</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 1, minWidth: 300 }}>
                        <TextField label="Username" value={formValues.username} onChange={handleFieldChange('username')} />
                        <TextField label="Password" type="password" value={formValues.password} onChange={handleFieldChange('password')} />
                        <TextField label="Role" value={formValues.role} onChange={handleFieldChange('role')} select>
                            {ROLE_OPTIONS.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                    {selectedUser && <Button color="error" onClick={handleDelete}>Delete</Button>}
                    <Button variant="contained" onClick={selectedUser ? handleUpdate : handleCreate}>
                        {selectedUser ? 'Save changes' : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default UserDataGrid;
