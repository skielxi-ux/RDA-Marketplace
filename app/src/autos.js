import './styles/main.css';

import { initHeader } from './ui/header.js';
import { initDrawer } from './ui/drawer.js';
import { initAuth } from './ui/auth.js';
import { initSelects } from './ui/selectPro.js';
import { initListing } from './ui/listing.js';

document.documentElement.classList.add('js');

initHeader();
initDrawer();
initListing();
initAuth();
initSelects();
