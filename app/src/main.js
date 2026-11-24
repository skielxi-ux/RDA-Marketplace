import 'swiper/css';
import 'swiper/css/effect-fade';
import './styles/main.css';

import { initHeader } from './ui/header.js';
import { initDrawer } from './ui/drawer.js';
import { initHero } from './ui/hero.js';
import { initSearch } from './ui/search.js';
import { initBodyTypes, initFeatured } from './ui/sliders.js';
import { initReveal } from './ui/reveal.js';

document.documentElement.classList.add('js');

initHeader();
initDrawer();
initHero();
initSearch();
initBodyTypes();
initFeatured();
initReveal();
