import './styles/main.css';

import { initHeader } from './ui/header.js';
import { initDrawer } from './ui/drawer.js';
import { initAuth } from './ui/auth.js';
import { initSelects } from './ui/selectPro.js';
import { initListing } from './ui/listing.js';
import { initAlertaListado } from './ui/alertaListado.js';

document.documentElement.classList.add('js');

initHeader();
initDrawer();
initListing();
initAlertaListado();
initAuth();
initSelects();
