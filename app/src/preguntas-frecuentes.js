// Preguntas frecuentes: todo viene prerenderizado; acá solo lo común del sitio.
import './styles/main.css';

import { initHeader } from './ui/header.js';
import { initDrawer } from './ui/drawer.js';
import { initAuth } from './ui/auth.js';

document.documentElement.classList.add('js');

initHeader();
initDrawer();
initAuth();
