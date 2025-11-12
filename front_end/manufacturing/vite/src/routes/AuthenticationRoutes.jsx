import { lazy } from 'react';

// project imports
import Loadable from 'ui-component/Loadable';
import MinimalLayout from 'layout/MinimalLayout';

// maintenance routing
// Catatan: Pastikan import ini menunjuk ke file yang BENAR (views/pages/authentication/Login.jsx)
const LoginPage = Loadable(lazy(() => import('views/pages/authentication/Login')));
const RegisterPage = Loadable(lazy(() => import('views/pages/authentication/Register')));

// ==============================|| AUTHENTICATION ROUTING ||============================== //

const AuthenticationRoutes = {
    // 🚩 PERBAIKAN KRITIS: Jadikan '/pages' sebagai path induk
    path: '/pages', 
    element: <MinimalLayout />,
    children: [
        {
            // Path: [basename]/pages/login (misalnya /free/pages/login)
            path: 'login', 
            element: <LoginPage />
        },
        {
            // Path: [basename]/pages/register (misalnya /free/pages/register)
            path: 'register',
            element: <RegisterPage />
        }
    ]
};

export default AuthenticationRoutes;