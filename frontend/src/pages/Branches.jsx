import { Container, Typography, Box } from "@mui/material";
import AppHeader from "../components/layout/AppHeader.jsx";

import { useAuth } from "../context/AuthContext.jsx";


//SideMenu
import SideMenu from "../components/menu/SideMenu.jsx";

export default function Branches(){
  //stores the current user object and logout function from the global AuthContext
  const {user, logout} = useAuth();
  return (
    <>
      {/* SideMenu and AppNavBar will be here */}
      <SideMenu />
      <AppHeader username={user?.sub} role={user?.role} onLogout={logout} />
      <Container maxWidth="lg" sx={{ mt: 4 }}>

      </Container>
    </>
  );
}