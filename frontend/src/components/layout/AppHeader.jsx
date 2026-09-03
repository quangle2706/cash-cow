import { AppBar, Toolbar, IconButton, Typography, Box, Button } from "@mui/material"
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded'
import SideMenuMobile from "../menu/SideMenuMobile";
import { useState } from "react";

{/* Every React component must return a single (html) element. In this case, 
    we are returning an AppBar component from MUI, which acts as a top-level
    navigation bar that typically contains the application title and other
    navigation elements. The AppBar is wrapped in a Toolbar component which
    provide the alignment for the child elements. Inside the Toolbar, we have
    a PrecisionManufacturingIcon component, which is an icon component from MUI's
    Icon library.
    */}

//Day 7 - added username, role, onLogout to function params
function AppHeader({username, role, onLogout}) {

    const [open, setOpen] = useState(false);
    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <IconButton
                    color="inherit"
                    aria-label="Open navigation menu"
                    onClick={toggleDrawer(true)}
                    sx={{ display: { xs: 'inline-flex', md: 'none' } }}
                >
                    <MenuRoundedIcon />
                </IconButton>
                {/* <PrecisionManufacturingIcon sx={{ mr: 2}} /> */}
                {/* <Typography variant="h6" component="h1">
                    CASHCOW - Command Center
                </Typography> */}
                {username && (
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%',  gap: 2 }}>
                        <Typography variant="body2">{username.toUpperCase()} ({role})</Typography>
                        {/* <Button color="inherit" onClick={onLogout}>Log Out</Button> */}
                    </Box>
                )}
                <SideMenuMobile open={open} toggleDrawer={toggleDrawer} />
            </Toolbar>
        </AppBar>
    )
}

export default AppHeader;