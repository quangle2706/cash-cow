import { Container, Typography, Box } from "@mui/material";
import AppHeader from "./components/layout/AppHeader.jsx";

import LoginForm from "./components/auth/LoginForm.jsx";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";

import ATMDataGrid from "./components/atms/ATMDataGrid.jsx";

//a main dashboard component that renders the application header and robot data grid to authenticated users
function DashBoard(){
  //stores the current user object and logout function from the global AuthContext
  const {user, logout} = useAuth();
  return (
    <>
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
          {/* <DiscrepancyDataGrid />  */}
        </Box>
      </Container>
    </>
  );
}

function AppContent() {
  const {isAuthenticated} = useAuth();
  return isAuthenticated ? <DashBoard /> : <LoginForm />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>    
  );
}

export default App;