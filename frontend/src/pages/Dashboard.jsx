import { Container, Typography, Box } from "@mui/material";
import AppHeader from "../components/layout/AppHeader.jsx";

import { useAuth } from "../context/AuthContext.jsx";

import ATMDataGrid from "../components/atms/ATMDataGrid.jsx";
import DiscrepancyDataGrid from "../components/service-calls/DiscrepancyDataGrid.jsx";
import ATMServiceCallRatioDataGrid from "../components/atms/ATMServiceCallRatioDataGrid.jsx";
import BranchMaintenanceDataGrid from "../components/branches/BranchMaintenanceDataGrid.jsx";

//SideMenu
import SideMenu from "../components/menu/SideMenu.jsx";

//a main dashboard component that renders the application header and robot data grid to authenticated users
export default function DashBoard(){
  //stores the current user object and logout function from the global AuthContext
  const {user, logout} = useAuth();
  return (
    <>
      {/* SideMenu and AppNavBar will be here */}
      <SideMenu />
      <Box sx={{ ml: { xs: 0, md: '240px', lg: '200px' } }}>
        <AppHeader username={user?.sub} role={user?.role} onLogout={logout} />
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom sx={{ color: 'black' }}>
            CashCow Overview
          </Typography>
          <Box sx={{ mb: 4 }}>
            <ATMDataGrid />
          </Box>
          <Typography variant="h5" component="h2" gutterBottom sx={{ color: 'black' }}>
            Co-Location Discrepancies
          </Typography>
          <Box sx={{ mb: 4 }}>
            <DiscrepancyDataGrid /> 
          </Box>
          <Typography variant="h5" component="h2" gutterBottom sx={{ color: 'black' }}>
            Completion/Failure Ratio by ATM Model
          </Typography>
          <Box sx={{ mb: 4 }}>
            <ATMServiceCallRatioDataGrid />
          </Box>
          <Typography variant="h5" component="h2" gutterBottom sx={{ color: 'black' }}>
            Branch Maintenance Flags
          </Typography>
          <Box sx={{ mb: 4 }}>
            <BranchMaintenanceDataGrid />
          </Box>
        </Container>
      </Box>
    </>
  );
}