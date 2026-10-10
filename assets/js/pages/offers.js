/** Offers page: deal cards with coupon copy + countdowns. */
import { $, el } from '../core/utils.js';
import { t } from '../core/i18n.js';
import { MENU } from '../data/menu.js';
import { createCountdown, countdownHTML, endOfDay } from '../components/countdown.js';
import { toast } from '../components/toast.js';
import { renderCard } from '../components/card.js';

const DEALS = [
  { code: 'WELCOME20', cls: 'red', discount: '20%', title: 'First Order', desc: 'New here? Enjoy 20% off your first order.', days: 7 },
  { code: 'FLAME10', cls: 'yellow', discount: '10%', title: 'Any Order', desc: '10% off every order, no minimum spend.', days: 3 },
  { code: 'FREEDELIVERY', cls: 'orange', discount: '0 EGP', title: 'Free Delivery', desc: 'Free delivery on any order this week.', days: 2 }
];

export async function init() {
  const combos = MENU.filter((m) => m.category === 'combos' && m.oldPrice);
  $('#main').innerHTML = `<div class="page-hero"><div class="container"><h1>${t('offers.title')}</h1><p>${t('offers.sub')}</p></div></div>
  <div class="container section">
    <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(280px,1fr))" id="dealGrid"></div>
    <div class="section-head" style="margin-top:64px"><span class="eyebrow">🍱 ${t('home.comboTitle')}</span><h2>${t('home.comboTitle')}</h2><p>${t('home.comboSub')}</p></div>
    <div class="grid menu-grid" id="comboGrid"></div>
  </div>`;

  const grid = $('#dealGrid');
  DEALS.forEach((d) => {
    const card = el('div', { class: `offer-card ${d.cls} reveal` });
    card.innerHTML = `<span class="badge badge-new">${d.days} ${t('offers.endsIn').toLowerCase()}</span>
      <div><div class="discount">${d.discount}</div><h3 style="${d.cls === 'yellow' ? '' : 'color:#fff'};margin:4px 0">${d.title}</h3><p style="margin:0;opacity:.9">${d.desc}</p></div>
      <div><div class="coupon-copy"><i class="fa-solid fa-ticket"></i><span>${d.code}</span><button class="btn btn-sm btn-dark" data-copy="${d.code}">${t('offers.copy')}</button></div></div>`;
    const cd = el('div', { class: 'countdown mt-4' });
    cd.innerHTML = countdownHTML();
    card.append(cd);
    grid.append(card);
    createCountdown(cd, Date.now() + d.days * 864e5);
  });

  grid.addEventListener('click', async (e) => {
    const b = e.target.closest('[data-copy]'); if (!b) return;
    const code = b.dataset.copy;
    try { await navigator.clipboard.writeText(code); toast(`<strong>${code}</strong> — ${t('offers.copied')}`, 'success'); }
    catch { toast(t('toast.copied'), 'info'); }
    b.textContent = '✓';
  });

  const comboGrid = $('#comboGrid');
  combos.forEach((c) => comboGrid.append(renderCard(c)));
}
