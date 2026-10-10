/**
 * FLAME BITES — single source of truth for all editable restaurant data.
 * Edit THIS file to rebrand the whole site (name, colors, phone, address, hours...).
 */
export const CONFIG = {
  name: 'Flame Bites',
  tagline: 'Fast. Flame-Grilled. Fresh.',
  taglineAr: 'سريع. مشوي على اللهب. طازج.',
  description: 'Bold flame-grilled burgers, crispy fried chicken, wraps and more — delivered hot to your door in 30 minutes.',
  logoFlame: '#E4002B',
  phone: '+20 100 123 4567',
  phoneHref: 'tel:+201001234567',
  whatsapp: '201001234567',
  email: 'hello@flamebites.example',
  address: '24 Corniche El Nil, Maadi, Cairo, Egypt',
  deliveryTime: '25–35 min',
  deliveryFee: 25,
  freeDeliveryOver: 250,
  taxRate: 0.14,
  currency: 'EGP',
  social: {
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com',
    twitter: 'https://twitter.com',
    youtube: 'https://youtube.com'
  },
  /** 0 = Sunday ... 6 = Saturday. open/close in 24h "HH:MM" */
  hours: [
    { day: 0, open: '10:00', close: '23:00' },
    { day: 1, open: '10:00', close: '23:00' },
    { day: 2, open: '10:00', close: '23:00' },
    { day: 3, open: '10:00', close: '23:00' },
    { day: 4, open: '10:00', close: '23:00' },
    { day: 5, open: '10:00', close: '00:30' },
    { day: 6, open: '10:00', close: '00:30' }
  ],
  promos: [
    '🔥 Free delivery on orders over 250 EGP',
    '🍔 Buy 2 Burgers, get a Free Side this week!',
    '🎉 Use code FLAME10 for 10% off your first order'
  ],
  appLinks: { apple: '#', google: '#' },
  /**
   * Brand palette. These values are also mirrored in assets/css/variables.css.
   * Kept here so JS (theme/canvas) can read them at runtime.
   */
  colors: {
    redPrimary: '#DA291C',
    redDeep: '#B3001B',
    redBright: '#E4002B',
    yellowPrimary: '#FFC72C',
    orangeAccent: '#FF8200',
    cream: '#FFF8E7',
    black: '#1A1A1A'
  },
  coupons: {
    FLAME10: { type: 'percent', value: 10, label: '10% off' },
    FREEDELIVERY: { type: 'delivery', value: 100, label: 'Free delivery' },
    WELCOME20: { type: 'percent', value: 20, label: '20% off first order' }
  },
  hoursText: 'Mon–Fri 10:00–23:00 · Sat–Sun 10:00–00:30'
};

export default CONFIG;
