import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { Box } from '@mui/material';
import Drawer, { drawerClasses } from '@mui/material/Drawer';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import MenuContent from './MenuContent';
import MenuButton from './MenuButton';
import appHeading from '../../assets/app-heading.png';

export default function SideMenuMobile({ open, toggleDrawer }) {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={toggleDrawer(false)}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        [`& .${drawerClasses.paper}`]: {
          // backgroundImage: 'none',
          // backgroundColor: 'background.paper',
          backgroundColor: '#033785',
          color: '#FFFFFF',
        },
      }}
    >
      <Stack
        sx={{
          maxWidth: '70dvw',
          height: '100%',
        }}
      >
        <Stack direction="row" sx={{ p: 2, pb: 0, gap: 1 }}>
          <Stack
            direction="row"
            sx={{ gap: 1, alignItems: 'center', flexGrow: 1, p: 1 }}
          >
            {/* <Avatar
              sizes="small"
              alt=""
              src="/static/images/avatar/7.jpg"
              sx={{ width: 24, height: 24 }}
            /> */}
            {/* <Typography component="p" variant="h6">
              
            </Typography> */}
            <Box
              component="img"
              src={appHeading}
              alt="AppHeading"
              sx={{
                  height: 60,
                  objectFit: 'contain',
              }}
            />
          </Stack>
          <MenuButton>
            {/* <NotificationsRoundedIcon /> */}
          </MenuButton>
        </Stack>
        <Divider />
        <Stack sx={{ flexGrow: 1 }}>
          <MenuContent />
          <Divider />
        </Stack>
        <Stack sx={{ p: 2 }}>
          <Button variant="outlined" fullWidth startIcon={<LogoutRoundedIcon />}>
            Logout
          </Button>
        </Stack>
      </Stack>
    </Drawer>
  );
}