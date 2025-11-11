// assets
import { IconDashboard, IconForms, IconLayoutGrid } from '@tabler/icons-react'; // 1. Mengganti IconTable dengan IconLayoutGrid

// constant
const icons = { IconDashboard, IconForms, IconLayoutGrid }; // 2. Memastikan IconLayoutGrid ada di konstanta icons

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const dashboard = {
    id: 'dashboard',
    title: 'Dashboard',
    type: 'group',
    children: [
        {
            id: 'default',
            title: 'Dashboard',
            type: 'item',
            url: '/dashboard/default',
            icon: icons.IconDashboard,
            breadcrumbs: false
        },
        // --- ITEM UNTUK FORM INPUT ---
        {
            id: 'util-form-input',
            title: 'Input Form',
            type: 'item',
            url: '/form-input', 
            icon: icons.IconForms, 
            breadcrumbs: true
        },
        // --- ITEM UNTUK SAMPLE PAGE (Icon Layout Grid/Tabel) ---
        {
            id: 'sample-page', 
            title: 'Table', 
            type: 'item',
            url: '/sample-page', 
            icon: icons.IconLayoutGrid,
            breadcrumbs: true
        }
    ]
};

export default dashboard;