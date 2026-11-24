import './styles/main.css';

import { initHeader } from './ui/header.js';
import { initDrawer } from './ui/drawer.js';
import { initAuth } from './ui/auth.js';
import { initPublicar } from './ui/publicar.js';

document.documentElement.classList.add('js');

initHeader();
initDrawer();
initPublicar();
initAuth();
