import { Routes, Route } from 'react-router-dom';
import { Typography } from '@mui/material';

import LoginForm from "./components/auth/LoginForm.jsx";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import DashBoard from './pages/Dashboard.jsx';
import Atms from './pages/Atms.jsx';
import Branches from './pages/Branches.jsx';
import ServiceCalls from './pages/ServiceCalls.jsx';
import Users from './pages/Users.jsx';

function AppContent() {
  const {isAuthenticated} = useAuth();
  return isAuthenticated ? <><Routes>
      <Route path='/' element={<DashBoard />} />
      <Route path='/branches' element={<Branches />} />
      <Route path='/atms' element={<Atms />} />
      <Route path='/service-calls' element={<ServiceCalls />} />
      <Route path='/users' element={<Users />} />
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