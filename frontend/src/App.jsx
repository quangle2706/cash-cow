import { Routes, Route } from 'react-router-dom';
import { Typography } from '@mui/material';

import LoginForm from "./components/auth/LoginForm.jsx";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import DashBoard from './pages/Dashboard.jsx';

function AppContent() {
  const {isAuthenticated} = useAuth();
  return isAuthenticated ? <><Routes>
      <Route path='/' element={<DashBoard />} />
      <Route path='/branches' element={<Typography variant="h5">Branches</Typography>} />
      <Route path='/atms' element={<Typography variant="h5">ATMs</Typography>} />
      <Route path='/service-calls' element={<Typography variant="h5">Service Calls</Typography>} />
      <Route path='/technicians' element={<Typography variant="h5">Technicians</Typography>} />
      <Route path='/analytics' element={<Typography variant="h5">Analytics</Typography>} />
    </Routes></> : <LoginForm />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>    
  );
}

export default App;