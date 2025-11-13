import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom'; // 1. IMPORT useNavigate

// material-ui
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';

// project imports
import Footer from './Footer';
import Header from './Header';
import Sidebar from './Sidebar';
import MainContentStyled from './MainContentStyled';
import Customization from '../Customization';
import Loader from 'ui-component/Loader';
import Breadcrumbs from 'ui-component/extended/Breadcrumbs';

import useConfig from 'hooks/useConfig';
import { handlerDrawerOpen, useGetMenuMaster } from 'api/menu';

// ==============================|| MAIN LAYOUT ||============================== //

export default function MainLayout() {
    const theme = useTheme();
    const navigate = useNavigate(); // 2. INISIALISASI useNavigate
    const downMD = useMediaQuery(theme.breakpoints.down('md'));

    const {
        state: { borderRadius, miniDrawer }
    } = useConfig();
    const { menuMaster, menuMasterLoading } = useGetMenuMaster();
    const drawerOpen = menuMaster?.isDashboardDrawerOpened;

    // --- 3. LOGIKA AUTH GUARD ---
    useEffect(() => {
        const token = localStorage.getItem('accessToken');

        // Jika token tidak ada, arahkan ke halaman login
        if (!token) {
            // Menggunakan path /pages/login agar Router menambahkan /free/ di depannya
            console.log("No access token found. Redirecting to login.");
            navigate('/pages/login', { replace: true });
        }

        // Catatan: Jika token ada, komponen akan melanjutkan rendering
    }, [navigate]); // navigate harus menjadi dependency

    // --- Logika Drawer & Menu ---
    useEffect(() => {
        handlerDrawerOpen(!miniDrawer);
    }, [miniDrawer]);

    useEffect(() => {
        downMD && handlerDrawerOpen(false);
    }, [downMD]);

    // horizontal menu-list bar : drawer

    if (menuMasterLoading) return <Loader />;
    
    // Jika token tidak ada, navigasi akan terjadi sebelum return di bawah ini dijalankan.
    // Jika token ada, layout akan dirender.
    return (
        <Box sx={{ display: 'flex' }}>
            {/* header */}
            <AppBar enableColorOnDark position="fixed" color="inherit" elevation={0} sx={{ bgcolor: 'background.default' }}>
                <Toolbar sx={{ p: 2 }}>
                    <Header />
                </Toolbar>
            </AppBar>

            {/* menu / drawer */}
            <Sidebar />

            {/* main content */}
            <MainContentStyled {...{ borderRadius, open: drawerOpen }}>
                <Box sx={{ ...{ px: { xs: 0 } }, minHeight: 'calc(100vh - 128px)', display: 'flex', flexDirection: 'column' }}>
                    {/* breadcrumb */}
                    <Breadcrumbs />
                    <Outlet />
                    <Footer />
                </Box>
            </MainContentStyled>
            <Customization />
        </Box>
    );
}