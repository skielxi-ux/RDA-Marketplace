import 'swiper/css';
import 'swiper/css/effect-fade';
import './styles/main.css';

import { initHeader } from './ui/header.js';
import { initDrawer } from './ui/drawer.js';
import { initAuth } from './ui/auth.js';
import { initHero } from './ui/hero.js';
import { initSearch } from './ui/search.js';
import { initBodyTypes, initFeatured } from './ui/sliders.js';
import { initReveal } from './ui/reveal.js';
import { initCounters } from './ui/counters.js';

document.documentElement.classList.add('js');

initHeader();
initDrawer();
initHero();
initSearch();
initBodyTypes();
initFeatured();
initReveal();
initCounters();
initAuth();
