/** Top bar + sticky header + mobile drawer + bottom nav + global chrome. */
import { CONFIG } from '../core/config.js';
import { $, $$, el, isOpenNow, formatTime12, scrollLock, lazyImg } from '../core/utils.js';
import { t, getLang, toggleLang } from '../core/i18n.js';
import { toggleTheme, getTheme } from '../core/theme.js';
import { currencyList, getCurrency, setCurrency } from '../core/currency.js';
import { cartCount, on } from '../core/store.js';
import { openCartDrawer } from './cart-drawer.js';
import { initSearch } from './search.js';

export const LOGO_SVG = `<svg viewBox="0 0 64 64" role="img" aria-label="Flame Bites logo"><defs><linearGradient id="fbG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFC72C"/><stop offset="1" stop-color="#DA291C"/></linearGradient></defs><path fill="url(#fbG)" d="M32 3c-3 8-12 12-12 24 0 8 6 14 12 14s12-6 12-14c0-5-3-9-3-9s-1 4-3 4c1-7-6-13-6-19z"/><path fill="#FFF3D0" opacity=".92" d="M32 26c-2 4-5 5-5 10 0 3 2 6 5 6s5-3 5-6c0-3-3-5-5-10z"/></svg>`;

const NAV = [
  ['index.html', 'nav.home', 'home'], ['menu.html', 'nav.menu', 'menu'], ['offers.html', 'nav.offers', 'offers'],
  ['reservation.html', 'nav.reservation', 'reservation'], ['branches.html', 'nav.branches', 'branches'],
  ['about.html', 'nav.about', 'about'], ['contact.html', 'nav.contact', 'contact']
];

function statusHTML() {
  const s = isOpenNow();
  return `<span class="status ${s.open ? '' : 'closed'}"><span class="dot"></span>${s.open ? t('branches.open') : t('branches.closed')}${s.open ? ` · ${t('common.prep')} ${CONFIG.deliveryTime}` : ''}</span>`;
}

function promoHTML() {
  return CONFIG.promos.map((p, i) => `<span class="${i === 0 ? '' : 'hide'}">${p}</span>`).join('');
}

function searchHTML(mobile = false) {
  return `<div class="search-box ${mobile ? 'mobile-only' : 'desktop-only'}" role="search">
    <i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
    <input type="search" id="${mobile ? 'searchMobile' : 'searchInput'}" placeholder="${t('common.search')}" aria-label="${t('common.search')}" autocomplete="off">
    <div class="autocomplete" id="${mobile ? 'acMobile' : 'acDesktop'}"></div>
  </div>`;
}

export function mountHeader() {
  const host = $('#site-header');
  if (!host) return;
  const page = document.body.dataset.page || 'home';

  host.innerHTML = `
  <div class="topbar">
    <div class="container">
      <div class="promo" id="topPromo">${promoHTML()}<button class="close icon-btn" style="width:auto;height:auto;background:none" aria-label="Dismiss promo"><i class="fa-solid fa-xmark"></i></button></div>
      <div class="meta">
        <span class="hours-txt hide-sm"><i class="fa-regular fa-clock"></i> ${CONFIG.hoursText}</span>
        <a href="${CONFIG.phoneHref}"><i class="fa-solid fa-phone"></i> ${CONFIG.phone}</a>
      </div>
    </div>
  </div>
  <header class="site-header" id="siteHeader">
    <div class="container">
      <button class="icon-btn mobile-only" id="hamburger" aria-label="Open menu" aria-expanded="false"><i class="fa-solid fa-bars"></i></button>
      <a class="logo" href="index.html" aria-label="${CONFIG.name} home">${LOGO_SVG}<span class="wordmark"><span class="flame">FLAME</span> <span class="bites">BITES</span></span></a>
      <nav class="nav" aria-label="Primary">
        ${NAV.map(([href, key, pg]) => `<a href="${href}" class="${pg === page ? 'active' : ''}" data-i18n="${key}">${t(key)}</a>`).join('')}
      </nav>
      <div class="header-actions">
        ${searchHTML()}
        <button class="icon-btn mobile-only" id="mobileSearchBtn" aria-label="${t('common.search')}"><i class="fa-solid fa-magnifying-glass"></i></button>
        <button class="icon-btn" id="themeToggle" aria-label="Toggle dark mode" title="Theme"><i class="fa-solid fa-${getTheme() === 'dark' ? 'sun' : 'moon'}"></i></button>
        <button class="icon-btn lang-switch" id="langToggle" aria-label="Switch language">${getLang() === 'ar' ? 'EN' : 'ع'}</button>
        <select class="icon-btn" id="currencySwitch" aria-label="Currency" style="width:auto;padding-inline:10px;font-weight:700;font-size:.8rem">
          ${currencyList.map((c) => `<option ${c === getCurrency() ? 'selected' : ''}>${c}</option>`).join('')}
        </select>
        <a class="icon-btn" href="login.html" aria-label="${t('nav.account')}"><i class="fa-solid fa-user"></i></a>
        <button class="icon-btn" id="cartBtn" aria-label="${t('nav.cart')}"><i class="fa-solid fa-bag-shopping"></i><span class="cart-badge" id="cartBadge">0</span></button>
        <a class="btn btn-primary desktop-only" href="menu.html">${t('nav.order')}</a>
      </div>
    </div>
  </header>

  <div class="drawer-backdrop" id="navBackdrop"></div>
  <aside class="drawer" id="navDrawer" aria-label="Mobile navigation">
    <div class="drawer-head">
      <a class="logo" href="index.html">${LOGO_SVG}<span class="wordmark"><span class="flame">FLAME</span> <span class="bites">BITES</span></span></a>
      <button class="icon-btn" id="closeDrawer" aria-label="Close menu"><i class="fa-solid fa-xmark"></i></button>
    </div>
    <nav>${NAV.map(([href, key, pg]) => `<a href="${href}" class="${pg === page ? 'active' : ''}" data-i18n="${key}"><i class="fa-solid ${pgIcon(pg)}"></i>${t(key)}</a>`).join('')}
      <a href="account.html" data-i18n="nav.account"><i class="fa-solid fa-user"></i>${t('nav.account')}</a>
    </nav>
    <div class="drawer-foot" style="padding:16px;border-top:1px solid var(--border);display:flex;gap:10px;justify-content:space-between;align-items:center">
      <button class="btn btn-outline btn-sm" id="drawerThemeToggle"><i class="fa-solid fa-${getTheme() === 'dark' ? 'sun' : 'moon'}"></i> Mode</button>
      <button class="btn btn-outline btn-sm" id="drawerLangToggle">${getLang() === 'ar' ? 'English' : 'العربية'}</button>
    </div>
  </aside>

  <nav class="bottom-nav" aria-label="Mobile quick nav">
    <ul>
      <li><a href="index.html" class="${page === 'home' ? 'active' : ''}"><i class="fa-solid fa-house"></i><span data-i18n="nav.home">${t('nav.home')}</span></a></li>
      <li><a href="menu.html" class="${page === 'menu' ? 'active' : ''}"><i class="fa-solid fa-book-open"></i><span data-i18n="nav.menu">${t('nav.menu')}</span></a></li>
      <li><a href="offers.html" class="${page === 'offers' ? 'active' : ''}"><i class="fa-solid fa-tags"></i><span data-i18n="nav.offers">${t('nav.offers')}</span></a></li>
      <li><a href="cart.html" class="${page === 'cart' ? 'active' : ''}"><i class="fa-solid fa-bag-shopping"></i><span data-i18n="nav.cart">${t('nav.cart')}</span><span class="cart-badge" data-badge>0</span></a></li>
      <li><a href="account.html" class="${page === 'account' ? 'active' : ''}"><i class="fa-solid fa-user"></i><span data-i18n="nav.account">${t('nav.account')}</span></a></li>
    </ul>
  </nav>
  <button class="fab-cart" id="fabCart" aria-label="${t('nav.cart')}"><i class="fa-solid fa-bag-shopping"></i></button>
  <div class="fab-contact">
    <a class="fab-whats" href="https://wa.me/${CONFIG.whatsapp}" target="_blank" rel="noopener" aria-label="WhatsApp"><i class="fa-brands fa-whatsapp"></i></a>
    <a class="fab-call" href="${CONFIG.phoneHref}" aria-label="Call us"><i class="fa-solid fa-phone"></i></a>
  </div>
  <button class="to-top" id="toTop" aria-label="Back to top"><i class="fa-solid fa-arrow-up"></i></button>`;

  wireHeader(page);
}

function pgIcon(pg) {
  return ({ home: 'fa-house', menu: 'fa-book-open', offers: 'fa-tags', reservation: 'fa-calendar-check', branches: 'fa-location-dot', about: 'fa-circle-info', contact: 'fa-envelope' })[pg] || 'fa-circle';
}

function wireHeader(page) {
  // cart badge
  const updateBadge = () => {
    const n = cartCount();
    $$('#cartBadge, [data-badge]').forEach((b) => { b.textContent = n; b.classList.toggle('show', n > 0); });
  };
  on('cart:change', updateBadge);
  updateBadge();

  $('#cartBtn')?.addEventListener('click', openCartDrawer);
  $('#fabCart')?.addEventListener('click', openCartDrawer);

  // theme
  const toggleThemeFn = (e) => {
    toggleTheme();
    $$('#themeToggle i, #drawerThemeToggle i').forEach((icon) => {
      icon.className = `fa-solid fa-${getTheme() === 'dark' ? 'sun' : 'moon'}`;
    });
  };
  $('#themeToggle')?.addEventListener('click', toggleThemeFn);
  $('#drawerThemeToggle')?.addEventListener('click', toggleThemeFn);

  // language
  const toggleLangFn = () => { toggleLang(); location.reload(); };
  $('#langToggle')?.addEventListener('click', toggleLangFn);
  $('#drawerLangToggle')?.addEventListener('click', toggleLangFn);

  // currency
  $('#currencySwitch')?.addEventListener('change', (e) => { setCurrency(e.target.value); location.reload(); });

  // mobile drawer
  const nav = $('#navDrawer'), bd = $('#navBackdrop');
  const openNav = () => { nav.classList.add('open'); bd.classList.add('open'); scrollLock(true); };
  const closeNav = () => { nav.classList.remove('open'); bd.classList.remove('open'); scrollLock(false); };
  $('#hamburger')?.addEventListener('click', openNav);
  $('#closeDrawer')?.addEventListener('click', closeNav);
  bd?.addEventListener('click', closeNav);

  // mobile search
  $('#mobileSearchBtn')?.addEventListener('click', () => {
    const box = $('.search-box.mobile-only');
    box.classList.toggle('mobile-open');
    if (box.classList.contains('mobile-open')) $('#searchMobile').focus();
  });

  // search instances
  initSearch($('#searchInput'), $('#acDesktop'));
  initSearch($('#searchMobile'), $('#acMobile'));

  // promo rotation
  const promo = $('#topPromo');
  if (promo) {
    const spans = $$('span', promo);
    let i = 0;
    if (spans.length > 1) setInterval(() => { spans[i].classList.add('hide'); i = (i + 1) % spans.length; spans[i].classList.remove('hide'); }, 4500);
    $('.close', promo)?.addEventListener('click', () => promo.closest('.topbar').remove());
  }

  // header shadow + back to top
  const header = $('#siteHeader'), toTop = $('#toTop');
  const onScroll = () => {
    header.classList.toggle('scrolled', scrollY > 8);
    toTop.classList.toggle('show', scrollY > 500);
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  toTop?.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));
}
