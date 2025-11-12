// src/components/ProfileSection.jsx (Asumsi)

import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
// Card, CardContent TIDAK DIPAKAI lagi setelah penghapusan
import Chip from '@mui/material/Chip';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Divider from '@mui/material/Divider';
import InputAdornment from '@mui/material/InputAdornment';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import OutlinedInput from '@mui/material/OutlinedInput';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Stack from '@mui/material/Stack';
// Switch TIDAK DIPAKAI lagi setelah penghapusan
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
// UpgradePlanCard TIDAK DIPAKAI lagi
import MainCard from 'ui-component/cards/MainCard';
import Transitions from 'ui-component/extended/Transitions';
import useConfig from 'hooks/useConfig';

// assets
import User1 from 'assets/images/users/user-round.svg';
import { IconLogout, IconSearch, IconSettings, IconUser } from '@tabler/icons-react';

// ==============================|| PROFILE MENU ||============================== //

// FUNGSI UTILITY: Mengambil username dari LocalStorage (ASUMSI)
const getUserName = () => {
    // 💡 ASUMSI: Username disimpan langsung atau di dalam objek user
    try {
        const username = localStorage.getItem('username'); // Coba ambil langsung username
        if (username) return username;

        const userData = localStorage.getItem('userData');
        if (userData) {
            const user = JSON.parse(userData);
            return user.username || user.email || 'User'; // Coba ambil dari objek
        }
    } catch (e) {
        console.error("Failed to parse user data from localStorage", e);
    }
    return 'Guest'; // Default jika gagal
};


export default function ProfileSection() {
    const theme = useTheme();
    const navigate = useNavigate();
    
    const {
        state: { borderRadius }
    } = useConfig();

    // 💡 PERUBAHAN: Hapus state sdm dan notification yang tidak dipakai
    // const [sdm, setSdm] = useState(true);
    const [value, setValue] = useState('');
    // const [notification, setNotification] = useState(false);
    const [open, setOpen] = useState(false);
    
    // 💡 PERUBAHAN: State untuk menyimpan nama pengguna
    const [currentUsername, setCurrentUsername] = useState('Loading...');

    const anchorRef = useRef(null);
    
    // 💡 PERUBAHAN: Ambil username saat komponen dimuat
    useEffect(() => {
        setCurrentUsername(getUserName());
    }, []);

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    };

    // --- FUNGSI LOGOUT ---
    const handleLogout = () => {
        localStorage.removeItem('accessToken'); 
        // 💡 OPSIONAL: Hapus juga data user lainnya
        localStorage.removeItem('username');
        localStorage.removeItem('userData'); 
        
        console.log('Token removed from localStorage. Logging out...');
        navigate('/pages/login', { replace: true }); 
        setOpen(false);
    };
    // -------------------

    const prevOpen = useRef(open);
    useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }

        prevOpen.current = open;
    }, [open]);

    return (
        <>
            <Chip
                slotProps={{ label: { sx: { lineHeight: 0 } } }}
                sx={{ ml: 2, height: '48px', alignItems: 'center', borderRadius: '27px' }}
                icon={
                    <Avatar
                        src={User1}
                        alt="user-images"
                        sx={{ typography: 'mediumAvatar', margin: '8px 0 8px 8px !important', cursor: 'pointer' }}
                        ref={anchorRef}
                        aria-controls={open ? 'menu-list-grow' : undefined}
                        aria-haspopup="true"
                        color="inherit"
                    />
                }
                label={<IconSettings stroke={1.5} size="24px" />}
                ref={anchorRef}
                aria-controls={open ? 'menu-list-grow' : undefined}
                aria-haspopup="true"
                onClick={handleToggle}
                color="primary"
                aria-label="user-account"
            />
            <Popper
                placement="bottom"
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
                modifiers={[
                    {
                        name: 'offset',
                        options: {
                            offset: [0, 14]
                        }
                    }
                ]}
            >
                {({ TransitionProps }) => (
                    <ClickAwayListener onClickAway={handleClose}>
                        <Transitions in={open} {...TransitionProps}>
                            <Paper>
                                {open && (
                                    <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
                                        <Box sx={{ p: 2, pb: 0 }}>
                                            <Stack>
                                                <Stack direction="row" sx={{ alignItems: 'center', gap: 0.5 }}>
                                                    <Typography variant="h4">Good Morning,</Typography>
                                                    {/* 💡 PERUBAHAN: Menampilkan username dari state */}
                                                    <Typography component="span" variant="h4" sx={{ fontWeight: 400 }}>
                                                        {currentUsername} 
                                                    </Typography>
                                                </Stack>
                                                <Typography variant="subtitle2">Project Admin</Typography>
                                            </Stack>
                                            <OutlinedInput
                                                sx={{ width: '100%', pr: 1, pl: 2, my: 2 }}
                                                id="input-search-profile"
                                                value={value}
                                                onChange={(e) => setValue(e.target.value)}
                                                placeholder="Search profile options"
                                                startAdornment={
                                                    <InputAdornment position="start">
                                                        <IconSearch stroke={1.5} size="16px" />
                                                    </InputAdornment>
                                                }
                                                aria-describedby="search-helper-text"
                                                slotProps={{ input: { 'aria-label': 'weight' } }}
                                            />
                                            <Divider />
                                        </Box>
                                        <Box
                                            sx={{
                                                p: 2,
                                                py: 0,
                                                height: '100%',
                                                maxHeight: 'calc(100vh - 250px)',
                                                overflowX: 'hidden',
                                                '&::-webkit-scrollbar': { width: 5 }
                                            }}
                                        >
                                            {/* ❌ PENGHAPUSAN: UpgradePlanCard */}
                                            {/* <UpgradePlanCard /> */}
                                            {/* <Divider /> */} 
                                            
                                            {/* ❌ PENGHAPUSAN: DND Mode Card */}
                                            {/* <Card sx={{ bgcolor: 'primary.light', my: 2 }}>
                                                <CardContent>
                                                    <Stack sx={{ gap: 3 }}>
                                                        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                                                            <Typography variant="subtitle1">Start DND Mode</Typography>
                                                            <Switch color="primary" checked={sdm} onChange={(e) => setSdm(e.target.checked)} name="sdm" size="small" />
                                                        </Stack>
                                                        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                                                            <Typography variant="subtitle1">Allow Notifications</Typography>
                                                            <Switch checked={notification} onChange={(e) => setNotification(e.target.checked)} name="sdm" size="small" />
                                                        </Stack>
                                                    </Stack>
                                                </CardContent>
                                            </Card> */}
                                            
                                            <Divider />
                                            <List
                                                component="nav"
                                                sx={{
                                                    width: '100%',
                                                    maxWidth: 350,
                                                    minWidth: 300,
                                                    borderRadius: `${borderRadius}px`,
                                                    '& .MuiListItemButton-root': { mt: 0.5 }
                                                }}
                                            >
                                                <ListItemButton sx={{ borderRadius: `${borderRadius}px` }}>
                                                    <ListItemIcon>
                                                        <IconSettings stroke={1.5} size="20px" />
                                                    </ListItemIcon>
                                                    <ListItemText primary={<Typography variant="body2">Account Settings</Typography>} />
                                                </ListItemButton>
                                                <ListItemButton sx={{ borderRadius: `${borderRadius}px` }}>
                                                    <ListItemIcon>
                                                        <IconUser stroke={1.5} size="20px" />
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        primary={
                                                            <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                                                                <Typography variant="body2">Social Profile</Typography>
                                                                <Chip
                                                                    slotProps={{
                                                                        label: { sx: { mt: 0.25 } }
                                                                    }}
                                                                    label="02"
                                                                    variant="filled"
                                                                    size="small"
                                                                    color="warning"
                                                                />
                                                            </Stack>
                                                        }
                                                    />
                                                </ListItemButton>
                                                {/* LIST ITEM LOGOUT */}
                                                <ListItemButton 
                                                    sx={{ borderRadius: `${borderRadius}px` }}
                                                    onClick={handleLogout} 
                                                >
                                                    <ListItemIcon>
                                                        <IconLogout stroke={1.5} size="20px" />
                                                    </ListItemIcon>
                                                    <ListItemText primary={<Typography variant="body2">Logout</Typography>} />
                                                </ListItemButton>
                                            </List>
                                        </Box>
                                    </MainCard>
                                )}
                            </Paper>
                        </Transitions>
                    </ClickAwayListener>
                )}
            </Popper>
        </>
    );
}