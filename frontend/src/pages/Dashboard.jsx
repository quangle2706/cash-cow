import { Container, Typography, Box } from "@mui/material";
import AppHeader from "../components/layout/AppHeader.jsx";

import { useAuth } from "../context/AuthContext.jsx";

import ATMDataGrid from "../components/atms/ATMDataGrid.jsx";
import DiscrepancyDataGrid from "../components/service-calls/DiscrepancyDataGrid.jsx";

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
      <AppHeader username={user?.sub} role={user?.role} onLogout={logout} />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          CashCow Overview
        </Typography>
        <Box sx={{ mb: 4 }}>
          <ATMDataGrid />
        </Box>
        <Typography variant="h5" component="h2" gutterBottom>
          Co-Location Discrepancies
        </Typography>
        <Box sx={{ mb: 4 }}>
          <DiscrepancyDataGrid /> 
        </Box>
      </Container>
    </>
  );
}