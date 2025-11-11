import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));

// utilities routing
const UtilsTypography = Loadable(lazy(() => import('views/utilities/Typography')));
const UtilsColor = Loadable(lazy(() => import('views/utilities/Color')));
const UtilsShadow = Loadable(lazy(() => import('views/utilities/Shadow')));

// sample page routing
const SamplePage = Loadable(lazy(() => import('views/sample-page')));

// form routing BARU
const FormPage = Loadable(lazy(() => import('views/form'))); // BARU: Menambahkan loadable untuk FormPage

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
    path: '/',
    element: <MainLayout />,
    children: [
        {
            path: '/',
            element: <DashboardDefault />
        },
        {
            path: 'dashboard',
            children: [
                {
                    path: 'default',
                    element: <DashboardDefault />
                }
            ]
        },
        // --- Utilities Routes ---
        {
            path: 'typography',
            element: <UtilsTypography />
        },
        {
            path: 'color',
            element: <UtilsColor />
        },
        {
            path: 'shadow',
            element: <UtilsShadow />
        },
        // --- Sample Page Route ---
        {
            path: '/sample-page',
            element: <SamplePage />
        },
        // --- Form Route BARU ---
        {
            path: 'form-input', // Anda dapat mengubah path ini sesuai keinginan, misalnya 'form'
            element: <FormPage /> // Menggunakan komponen FormPage yang sudah di-lazy load
        }
    ]
};

export default MainRoutes;