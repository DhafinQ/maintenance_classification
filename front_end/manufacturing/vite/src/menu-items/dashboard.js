// assets
import { IconForms, IconLayoutGrid, IconChartBar } from '@tabler/icons-react';

// Hapus IconDashboard karena tidak digunakan lagi
const icons = { IconForms, IconLayoutGrid, IconChartBar };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const dashboard = {
    id: 'dashboard',
    title: 'Menu Items',
    type: 'group',
    children: [
        // --- ITEM UNTUK FORM INPUT ---
        {
            id: 'util-form-input',
            title: 'Input Form',
            type: 'item',
            url: '/form-input',
            icon: icons.IconForms,
            breadcrumbs: true
        },

        // --- ITEM UNTUK SAMPLE PAGE (Tabel) ---
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
