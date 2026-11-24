import './styles/main.css';

import { initHeader } from './ui/header.js';
import { initDrawer } from './ui/drawer.js';
import { initListing } from './ui/listing.js';

document.documentElement.classList.add('js');

initHeader();
initDrawer();
initListing();
