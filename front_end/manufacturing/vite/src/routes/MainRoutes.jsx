import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('Views/dashboard/Default'))); // DIKOREKSI: Views/
// sample page routing
const SamplePage = Loadable(lazy(() => import('Views/sample-page'))); // DIKOREKSI: Views/
// form routing BARU
const FormPage = Loadable(lazy(() => import('Views/form'))); // DIKOREKSI: Views/
// prediction chart dashboard routing BARU
const PredictionChartDashboard = Loadable(lazy(() => import('Views/dashboard-chart/Dashboard'))); // DIKOREKSI: Views/

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
    path: '/',
    element: <MainLayout />,
    children: [
        {
            path: '/',
            element: <PredictionChartDashboard />
        },

        // --- ROUTE BARU: Prediction Chart Dashboard ---
        {
            path: 'dashboard-chart',
            element: <PredictionChartDashboard />
        },

        // --- Sample Page Route ---
        {
            path: 'sample-page',
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
