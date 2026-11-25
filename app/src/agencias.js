// Agencias: directorio de agencias aprobadas (se carga en vivo).
import './styles/main.css';

import { initHeader } from './ui/header.js';
import { initDrawer } from './ui/drawer.js';
import { initAuth } from './ui/auth.js';
import { initAgencias } from './ui/agencias.js';

document.documentElement.classList.add('js');

initHeader();
initDrawer();
initAgencias();
initAuth();
