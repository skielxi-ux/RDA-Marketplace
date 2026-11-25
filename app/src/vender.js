// Vendé tu auto (particulares)
import './styles/main.css';

import { initHeader } from './ui/header.js';
import { initDrawer } from './ui/drawer.js';
import { initAuth } from './ui/auth.js';
import { initVender } from './ui/vender.js';

document.documentElement.classList.add('js');

initHeader();
initDrawer();
initVender();
initAuth();
