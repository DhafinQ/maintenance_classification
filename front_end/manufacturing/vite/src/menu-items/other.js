// src/menu-items/index.js

import dashboard from './dashboard';
import pages from './pages';
import utilities from './utilities';
// import other from './other'; // <-- Baris ini dihapus

// ==============================|| MENU ITEMS ||============================== //

const menuItems = {
    // Menghapus 'other' dari daftar item
    items: [dashboard, pages, utilities] 
};

export default menuItems;