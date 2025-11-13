import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';

// Pastikan semua impor menggunakan path folder yang benar
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default'))); 
const SamplePage = Loadable(lazy(() => import('views/sample-page'))); 
const FormPage = Loadable(lazy(() => import('views/form'))); 
const PredictionChartDashboard = Loadable(lazy(() => import('views/dashboard-chart/Dashboard'))); 

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
    path: '/',
    element: <MainLayout />,
    children: [
        {
            // Root utama aplikasi setelah login: /free/
            path: '/',
            element: <FormPage />
        },

        // --- ROUTE: Prediction Chart Dashboard ---
        {
            path: 'dashboard-chart', // Path: /free/dashboard-chart
            element: <PredictionChartDashboard />
        },

        // --- Sample Page Route ---
        {
            path: 'sample-page', // Path: /free/sample-page
            element: <SamplePage />
        },

        // --- Form Route ---
        {
            path: 'form-input', // Path: /free/form-input
            element: <FormPage />
        }
    ]
};

export default MainRoutes;