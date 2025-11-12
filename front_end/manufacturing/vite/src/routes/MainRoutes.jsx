import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));

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
        // --- Sample Page Route ---
        {
            path: '/sample-page',
            element: <SamplePage />
        },
        // --- Form Route BARU ---
        {
            path: 'form-input',
            element: <FormPage />
        }
    ]
};

export default MainRoutes;