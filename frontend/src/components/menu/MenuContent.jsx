import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import AtmIcon from '@mui/icons-material/Atm'
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import CallIcon from '@mui/icons-material/Call';
import AnalyticsOutlinedIcon from '@mui/icons-material/AnalyticsOutlined';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import LogoutIcon from '@mui/icons-material/Logout'

const mainListItems = [
  { text: 'Dashboard', icon: <HomeOutlinedIcon /> },
  { text: 'Branches', icon: <AccountTreeOutlinedIcon /> },
  { text: 'ATMs', icon: <AtmIcon /> },
  { text: 'Service Calls', icon: <CallIcon /> },
  { text: 'Technicians', icon: <PeopleRoundedIcon /> },
  { text: 'Analytics', icon: <AnalyticsOutlinedIcon /> },
];

const secondaryListItems = [
  { text: 'Settings', icon: <SettingsRoundedIcon /> },
  { text: 'Logout', icon: <LogoutIcon /> },
];

export default function MenuContent() {
  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between' }}>
      <List dense>
        {mainListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: 'block', mb: 2, }}>
            <ListItemButton selected={index === 0}>
              <ListItemIcon sx={{ color: '#CBD5E1' }} >{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <List dense>
        {secondaryListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: 'block', mb: 2, }}>
            <ListItemButton>
              <ListItemIcon sx={{ color: '#CBD5E1' }} >{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}
