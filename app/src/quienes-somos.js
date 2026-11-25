// Quiénes somos: página institucional (todo el contenido viene prerenderizado en el build).
import './styles/main.css';

import { initHeader } from './ui/header.js';
import { initDrawer } from './ui/drawer.js';
import { initAuth } from './ui/auth.js';
import { initReveal } from './ui/reveal.js';

document.documentElement.classList.add('js');

initHeader();
initDrawer();
initReveal();
initAuth();
