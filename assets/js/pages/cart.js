/** Shopping cart page: line items, coupons, tips, summary, upsells. */
import { $, el } from '../core/utils.js';
import { t } from '../core/i18n.js';
import { money } from '../core/currency.js';
import { CONFIG } from '../core/config.js';
import { MENU } from '../data/menu.js';
import { getCart, cartSubtotal, cartCount, on, addToCart, getCoupon, setCoupon, clearCoupon, discountFor } from '../core/store.js';
import { buildLine } from '../components/cart-drawer.js';
import { toast } from '../components/toast.js';

let tipPct = 0;

export async function init() {
  $('#main').innerHTML = `<div class="page-hero"><div class="container"><h1>${t('cart.title')}</h1><p>${t('cart.sub')}</p></div></div>
  <div class="container section"><div id="cartRoot"></div></div>`;
  on('cart:change', render);
  on('coupon:change', render);
  render();
}

function totals() {
  const sub = cartSubtotal();
  const discount = discountFor(sub);
  const freeCoupon = getCoupon()?.type === 'delivery';
  const afterDiscount = Math.max(0, sub - discount);
  const delivery = (sub === 0 || afterDiscount >= CONFIG.freeDeliveryOver || freeCoupon) ? 0 : CONFIG.deliveryFee;
  const tip = tipPct ? Math.round(afterDiscount * tipPct / 100) : 0;
  const tax = Math.round(afterDiscount * CONFIG.taxRate);
  const total = afterDiscount + delivery + tax + tip;
  return { sub, discount, delivery, tax, tip, total };
}

function render() {
  const root = $('#cartRoot');
  const cart = getCart();
  if (!cart.length) {
    root.innerHTML = `<div class="empty-state reveal in"><div class="icon"><i class="fa-solid fa-bag-shopping"></i></div>
      <h2>${t('common.empty')}</h2><p>${t('common.emptyDesc')}</p>
      <a class="btn btn-primary btn-lg mt-4" href="menu.html"><i class="fa-solid fa-book-open"></i> ${t('common.viewMenu')}</a></div>`;
    return;
  }

  const T = totals();
  const coupon = getCoupon();
  root.innerHTML = `<div class="cart-layout">
    <div>
      <div style="background:var(--bg-elev);border-radius:var(--radius);box-shadow:var(--shadow-sm);padding:8px 16px" id="cartList"></div>
      <div class="card mt-4" style="padding:20px">
        <h3 style="margin-bottom:6px"><i class="fa-solid fa-plus" style="color:var(--red-primary)"></i> ${t('cart.addFries')}</h3>
        <div class="upsell-row" id="upsell"></div>
      </div>
    </div>
    <aside class="summary" id="summary"></aside>
  </div>`;

  const list = $('#cartList');
  cart.forEach((l) => list.append(buildLine(l)));

  // upsell sides/drinks
  const up = $('#upsell');
  MENU.filter((m) => (m.category === 'sides' || m.category === 'drinks') && !cart.some((c) => c.id === m.id)).slice(0, 4).forEach((m) => {
    up.append(el('div', { class: 'upsell-card' },
      el('img', { src: m.images[0], alt: m.name, loading: 'lazy' }),
      el('span', { class: 'name' }, m.name),
      el('button', { class: 'btn btn-primary btn-sm btn-block', onclick: () => { addToCart({ id: m.id, name: m.name, image: m.images[0], basePrice: m.size ? m.sizes[0].price : m.price, size: m.sizes && m.sizes.length ? m.sizes[0].name : '', extras: [], notes: '', spice: '' }, 1); toast(t('toast.added'), 'success'); } }, `<i class="fa-solid fa-plus"></i> ${money(m.price)}`)));
  });

  renderSummary(T, coupon);
}

function renderSummary(T, coupon) {
  const s = $('#summary');
  const progressPct = Math.min(100, Math.round((T.sub / CONFIG.freeDeliveryOver) * 100));
  s.innerHTML = `
    <h3 style="margin-bottom:12px"><i class="fa-solid fa-receipt"></i> ${t('cart.title')}</h3>
    <div class="progress light" style="margin-bottom:8px"><div class="bar" style="width:${progressPct}%"></div></div>
    <p style="font-size:.85rem;color:var(--text-muted)">${T.delivery === 0 ? '🎉 ' + t('cart.youGotFreeDelivery') : `${money(CONFIG.freeDeliveryOver - T.sub)} ${t('cart.freeDeliveryProgress')}`}</p>
    <div class="coupon-box">
      <input id="couponInput" placeholder="${t('cart.coupon')}" value="${coupon ? coupon.code : ''}" aria-label="${t('cart.coupon')}">
      <button class="btn btn-dark btn-sm" id="couponApply">${t('cart.apply')}</button>
    </div>
    ${coupon ? `<div class="flex between center" style="background:var(--bg-soft);border-radius:10px;padding:8px 12px;margin-bottom:12px"><span><i class="fa-solid fa-tag" style="color:var(--green,#2e7d32)"></i> <strong>${coupon.code}</strong> · ${coupon.label}</span><button class="ci-remove" id="couponRemove"><i class="fa-solid fa-xmark"></i></button></div>` : ''}
    <div class="summary-row"><span>${t('common.subtotal')} (${cartCount()})</span><span>${money(T.sub)}</span></div>
    ${T.discount ? `<div class="summary-row"><span>${t('common.discount')}</span><span style="color:var(--red-bright)">− ${money(T.discount)}</span></div>` : ''}
    <div class="summary-row"><span>${t('common.delivery')}</span><span>${T.delivery === 0 ? '<span style="color:#2e7d32;font-weight:700">FREE</span>' : money(T.delivery)}</span></div>
    <div class="summary-row"><span>${t('common.tax')} (${Math.round(CONFIG.taxRate * 100)}%)</span><span>${money(T.tax)}</span></div>
    <div class="summary-row"><span>${t('common.tip')}</span><span>${T.tip ? money(T.tip) : '—'}</span></div>
    <div class="tip-options" id="tipOptions">
      ${[0, 5, 10, 15].map((p) => `<button data-tip="${p}" class="${p === tipPct ? 'active' : ''}">${p === 0 ? 'No tip' : p + '%'}</button>`).join('')}
    </div>
    <div class="summary-row total"><span>${t('common.total')}</span><span>${money(T.total)}</span></div>
    <a class="btn btn-primary btn-lg btn-block mt-4" href="checkout.html"><i class="fa-solid fa-lock"></i> ${t('common.checkout')}</a>
    <a class="btn btn-ghost btn-block mt-2" href="menu.html"><i class="fa-solid fa-plus"></i> ${t('common.viewMenu')}</a>`;

  $('#couponApply').addEventListener('click', () => {
    const code = $('#couponInput').value;
    const res = setCoupon(code);
    toast(res ? t('toast.coupon') : t('toast.couponInvalid'), res ? 'success' : 'error');
  });
  $('#couponRemove')?.addEventListener('click', clearCoupon);
  $('#tipOptions')?.addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    tipPct = Number(b.dataset.tip);
    render();
  });
}
