// Íconos Lucide como SVG en línea. Se generan en el build (y al cambiar de pestaña),
// así no hace falta cargar ni escanear una librería de íconos en el navegador.
import {
  Menu, Phone, User, Search, ChevronDown, ChevronLeft, ChevronRight, ArrowUpRight, ArrowUp,
  Gauge, Fuel, Cog, Calendar, Bookmark, X, ShieldCheck, ReceiptText,
  Sparkle, BadgeCheck, Building2, Check, Quote, Camera, ClipboardCheck, MessageCircle, Plus,
  Store, FileSpreadsheet, Images, Bot, ArrowRight,
  CircleCheck, Tag, Heart, MapPin, SlidersHorizontal, ArrowUpDown, RotateCcw,
  Car, DoorOpen, Settings2, Palette, Share2,
  Eye, EyeOff, LogOut, Lock, Smartphone, LoaderCircle, ArrowLeft, CircleAlert, Bell, Handshake, Mail, Clock, Zap, DollarSign, Users, Send,
} from 'lucide';

const NODES = {
  bell: Bell, handshake: Handshake, mail: Mail, clock: Clock, zap: Zap, 'dollar-sign': DollarSign, users: Users, telegram: Send,
  menu: Menu, phone: Phone, user: User, search: Search, 'chevron-down': ChevronDown,
  'chevron-left': ChevronLeft, 'chevron-right': ChevronRight, 'arrow-up-right': ArrowUpRight,
  'arrow-up': ArrowUp, gauge: Gauge, fuel: Fuel, cog: Cog, calendar: Calendar, bookmark: Bookmark,
  x: X, 'shield-check': ShieldCheck, 'receipt-text': ReceiptText,
  sparkle: Sparkle, 'badge-check': BadgeCheck, 'building-2': Building2,
  check: Check, quote: Quote, camera: Camera, 'clipboard-check': ClipboardCheck,
  'message-circle': MessageCircle, plus: Plus, store: Store, 'file-spreadsheet': FileSpreadsheet,
  images: Images, bot: Bot, 'arrow-right': ArrowRight,
  'circle-check': CircleCheck, tag: Tag, heart: Heart, 'map-pin': MapPin,
  'sliders-horizontal': SlidersHorizontal, 'arrow-up-down': ArrowUpDown, 'rotate-ccw': RotateCcw,
  car: Car, 'door-open': DoorOpen, 'settings-2': Settings2, palette: Palette, 'share-2': Share2,
  eye: Eye, 'eye-off': EyeOff, 'log-out': LogOut, lock: Lock, smartphone: Smartphone,
  'loader-circle': LoaderCircle, 'arrow-left': ArrowLeft, 'circle-alert': CircleAlert,
};

// Íconos de marca (relleno, no trazo). WhatsApp: versión de un color de thesvg.org/icon/whatsapp.
const MARCAS = {
  whatsapp: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z',
};

const attrs = (o) => Object.entries(o).map(([k, v]) => `${k}="${v}"`).join(' ');

/** Devuelve el SVG del ícono. `cls` son clases de Tailwind (tamaño y color). */
export function icon(name, cls = 'h-4 w-4') {
  if (MARCAS[name]) return `<svg xmlns="http://www.w3.org/2000/svg" class="i-${name} ${cls}" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="${MARCAS[name]}"/></svg>`;
  const node = NODES[name];
  if (!node) throw new Error(`Ícono no registrado: ${name}`);
  const children = node.map(([tag, a]) => `<${tag} ${attrs(a)}/>`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" class="i-${name} ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${children}</svg>`;
}
