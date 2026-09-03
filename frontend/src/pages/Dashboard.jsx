import { Container, Typography, Box, Snackbar, Alert } from "@mui/material";
import AppHeader from "../components/layout/AppHeader.jsx";

import { useAuth } from "../context/AuthContext.jsx";

import ATMDataGrid from "../components/atms/ATMDataGrid.jsx";
import DiscrepancyDataGrid from "../components/service-calls/DiscrepancyDataGrid.jsx";
import ATMServiceCallRatioDataGrid from "../components/atms/ATMServiceCallRatioDataGrid.jsx";
import BranchMaintenanceDataGrid from "../components/branches/BranchMaintenanceDataGrid.jsx";
import ActiveTechnicianDataGrid from "../components/technicians/ActiveTechnicianDataGrid.jsx";

//SideMenu
import SideMenu from "../components/menu/SideMenu.jsx";
import { useState } from "react";

//a main dashboard component that renders the application header and robot data grid to authenticated users
export default function DashBoard(){
  //stores the current user object and logout function from the global AuthContext
  const {user, logout} = useAuth();
  const [notification, setNotification] = useState(null);

  return (
    <>
      {/* SideMenu and AppNavBar will be here */}
      <SideMenu />
      <Box sx={{ ml: { xs: 0, md: '240px', lg: '200px' } }}>
        <AppHeader username={user?.sub} role={user?.role} onLogout={logout} />
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Typography gutterBottom sx={{  textAlign:'left', color: 'black',  mb: '1rem', fontSize: '0.9rem', fontWeight: '600' }}>
            1. ATMs with Cash Level Above Threshold %
          </Typography>
          <Box sx={{ mb: 4 }}>
            <ATMDataGrid onSuccess={setNotification} />
          </Box>
          <Typography gutterBottom sx={{  textAlign:'left', color: 'black',  mb: '1rem', fontSize: '0.9rem', fontWeight: '600' }}>
            2. Co-Location Discrepancies
          </Typography>
          <Box sx={{ mb: 4 }}>
            <DiscrepancyDataGrid /> 
          </Box>
          <Typography gutterBottom sx={{  textAlign:'left', color: 'black',  mb: '1rem', fontSize: '0.9rem', fontWeight: '600' }}>
            3. Completion/Failure Ratio by ATM Model
          </Typography>
          <Box sx={{ mb: 4 }}>
            <ATMServiceCallRatioDataGrid />
          </Box>
          <Typography gutterBottom sx={{  textAlign:'left', color: 'black',  mb: '1rem', fontSize: '0.9rem', fontWeight: '600' }}>
            4. Branch Maintenance Flags
          </Typography>
          <Box sx={{ mb: 4 }}>
            <BranchMaintenanceDataGrid />
          </Box>
          <Typography gutterBottom sx={{  textAlign:'left', color: 'black',  mb: '1rem', fontSize: '0.9rem', fontWeight: '600' }}>
            5. Reporting Lines - Active Technicians Under A Specific Supervisor
          </Typography>
          <Box sx={{ mb: 4 }}>
            <ActiveTechnicianDataGrid />
          </Box>
        </Container>
        <Snackbar
          open={Boolean(notification)}
          autoHideDuration={4000}
          onClose={() => setNotification(null)}
        >
          <Alert severity="success" onClose={() => setNotification(null)} >{notification}</Alert>
        </Snackbar>
      </Box>
    </>
  );
}