import './styles/main.css';

import { initHeader } from './ui/header.js';
import { initDrawer } from './ui/drawer.js';
import { initAuth } from './ui/auth.js';
import { initMiCuenta } from './ui/micuenta.js';

document.documentElement.classList.add('js');

initHeader();
initDrawer();
initMiCuenta();
initAuth();
