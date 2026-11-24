// Íconos Lucide como SVG en línea. Se generan en el build (y al cambiar de pestaña),
// así no hace falta cargar ni escanear una librería de íconos en el navegador.
import {
  Menu, Phone, User, Search, ChevronDown, ChevronLeft, ChevronRight, ArrowUpRight, ArrowUp,
  Gauge, Fuel, Cog, Calendar, Bookmark, X, BadgePercent, ShieldCheck, ReceiptText, Wrench,
  Sparkle, BadgeCheck, Building2,
} from 'lucide';

const NODES = {
  menu: Menu, phone: Phone, user: User, search: Search, 'chevron-down': ChevronDown,
  'chevron-left': ChevronLeft, 'chevron-right': ChevronRight, 'arrow-up-right': ArrowUpRight,
  'arrow-up': ArrowUp, gauge: Gauge, fuel: Fuel, cog: Cog, calendar: Calendar, bookmark: Bookmark,
  x: X, 'badge-percent': BadgePercent, 'shield-check': ShieldCheck, 'receipt-text': ReceiptText,
  wrench: Wrench, sparkle: Sparkle, 'badge-check': BadgeCheck, 'building-2': Building2,
};

const attrs = (o) => Object.entries(o).map(([k, v]) => `${k}="${v}"`).join(' ');

/** Devuelve el SVG del ícono. `cls` son clases de Tailwind (tamaño y color). */
export function icon(name, cls = 'h-4 w-4') {
  const node = NODES[name];
  if (!node) throw new Error(`Ícono no registrado: ${name}`);
  const children = node.map(([tag, a]) => `<${tag} ${attrs(a)}/>`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${children}</svg>`;
}
