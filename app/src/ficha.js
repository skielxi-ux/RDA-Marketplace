import 'swiper/css';
import './styles/main.css';

import { initHeader } from './ui/header.js';
import { initDrawer } from './ui/drawer.js';
import { initAuth } from './ui/auth.js';
import { initFicha } from './ui/ficha.js';

document.documentElement.classList.add('js');

initHeader();
initDrawer();
initFicha();
initAuth();
