import { styled } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import MuiDrawer, { drawerClasses } from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import MenuContent from './MenuContent';
import appIcon from '../../assets/app-icon.png';

const drawerWidth = 240;

const Drawer = styled(MuiDrawer)({
  width: drawerWidth,
  flexShrink: 0,
  boxSizing: 'border-box',
  mt: 10,
  [`& .${drawerClasses.paper}`]: {
    width: drawerWidth,
    boxSizing: 'border-box',
  },
});

export default function SideMenu() {
  return (
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: 'none', md: 'block' },
        [`& .${drawerClasses.paper}`]: {
        //   backgroundColor: 'background.paper',
            backgroundColor: '#033785',
            color: '#FFFFFF',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          mt: 'calc(var(--template-frame-height, 0px) + 4px)',
          p: 1.5,
        }}
      >
        {/* Logo Icon + Heading */}
        <Box
            component="img"
            src={appIcon}
            alt="AppIcon"
            sx={{
                width: 60,
                height: 60,
                objectFit: 'contain',
            }}
        />

        <Box sx={{ marginLeft: 2 }}>
            <Typography
                sx={{
                    fontWeight: 700,
                    fontSize: '1.2rem',
                    lineHeight: 1.1,
                }}
            >
            CashCow
            </Typography>

            <Typography
            sx={{
                fontSize: '0.65rem',
                mt: 0.3,
            }}
            >
            ATM Operations
            </Typography>
        </Box>
      </Box>
      <Divider />
      <Box
        sx={{
          overflow: 'auto',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <MenuContent />
      </Box>
    </Drawer>
  );
}
