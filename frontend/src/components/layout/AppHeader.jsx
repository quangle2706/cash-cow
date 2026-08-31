import { AppBar, Toolbar, Typography, Box, Button } from "@mui/material"
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing'

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
    return (
        <AppBar position="static">
            <Toolbar>
                <PrecisionManufacturingIcon sx={{ mr: 2}} />
                <Typography variant="h6" component="h1">
                    CASHCOW - Command Center
                </Typography>
                {/** Day 7 Code HERE */}
                {username && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="body2">{username}({role})</Typography>
                        <Button color="inherit" onClick={onLogout}>Log Out</Button>
                    </Box>
                )}
                {/**END DAY 7 */}
            </Toolbar>
        </AppBar>
    )
}

export default AppHeader;