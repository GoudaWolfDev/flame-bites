/** FLAME BITES bootstrap: mounts chrome, loads the page controller, registers SW. */
import { $, el, readJSON, writeJSON, initReveal } from './core/utils.js';
import { t } from './core/i18n.js';
import { mountHeader, LOGO_SVG } from './components/header.js';
import { mountFooter } from './components/footer.js';
import { mountCartDrawer } from './components/cart-drawer.js';

const PAGES = {
  home: () => import('./pages/home.js'),
  menu: () => import('./pages/menu.js'),
  item: () => import('./pages/item.js'),
  cart: () => import('./pages/cart.js'),
  checkout: () => import('./pages/checkout.js'),
  offers: () => import('./pages/offers.js'),
  reservation: () => import('./pages/reservation.js'),
  branches: () => import('./pages/branches.js'),
  about: () => import('./pages/about.js'),
  contact: () => import('./pages/contact.js'),
  login: () => import('./pages/auth.js'),
  account: () => import('./pages/account.js'),
  'order-success': () => import('./pages/order-success.js'),
  404: () => import('./pages/404.js')
};

function pageLoader() {
  if ($('.page-loader')) return;
  const loader = el('div', { class: 'page-loader', id: 'loader' },
    el('div', { class: 'loader-logo', html: LOGO_SVG + `<p style="text-align:center;font-family:var(--font-head);margin-top:10px;letter-spacing:2px">FLAME BITES</p>` }));
  document.body.prepend(loader);
}

function cookieBanner() {
  if (readJSON('fb_cookie_ok', false)) return;
  const bar = el('div', { class: 'cookie-banner', role: 'region', 'aria-label': 'Cookie consent' },
    el('p', {}, el('strong', {}, t('cookie.title') + ' '), t('cookie.text')),
    el('div', { class: 'flex gap-3' },
      el('button', { class: 'btn btn-outline btn-sm', onclick: () => { writeJSON('fb_cookie_ok', true); bar.remove(); } }, t('cookie.decline')),
      el('button', { class: 'btn btn-secondary btn-sm', onclick: () => { writeJSON('fb_cookie_ok', true); bar.remove(); } }, t('cookie.accept'))));
  document.body.append(bar);
}

async function boot() {
  pageLoader();
  mountHeader();
  mountFooter();
  mountCartDrawer();
  cookieBanner();

  const page = document.body.dataset.page;
  try {
    if (PAGES[page]) {
      const mod = await PAGES[page]();
      if (mod && typeof mod.init === 'function') await mod.init();
    }
  } catch (err) {
    console.error('[FLAME BITES] page error:', err);
    const main = $('#main');
    if (main) main.insertAdjacentHTML('afterbegin', `<div class="container section"><div class="empty-state"><div class="icon"><i class="fa-solid fa-triangle-exclamation"></i></div><h2>Something went wrong</h2><p>Please refresh the page.</p></div></div>`);
  }

  initReveal();
  setTimeout(() => $('#loader')?.classList.add('done'), 350);
  registerSW();
}

function registerSW() {
  if (!('serviceWorker' in navigator) || location.protocol === 'file:') return;
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  });
}

let booted = false;
function start() { if (booted) return; booted = true; boot(); }
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
else start();
