/** Checkout 4-panel wizard with validation, Luhn, scheduling and order creation. */
import { $, $$, esc, isOpenNow, orderNumber } from '../core/utils.js';
import { t } from '../core/i18n.js';
import { money } from '../core/currency.js';
import { CONFIG } from '../core/config.js';
import { BRANCHES } from '../data/branches.js';
import { getCart, cartSubtotal, cartCount, clearCart, getCoupon, clearCoupon, discountFor, addOrder, getUser } from '../core/store.js';
import { buildLine } from '../components/cart-drawer.js';
import { toast } from '../components/toast.js';

let step = 1;
let tipPct = 0;
const data = { name: '', phone: '', email: '', method: 'delivery', address: '', branch: BRANCHES[0].id, schedule: 'asap', when: '', payment: 'card', card: { number: '', name: '', expiry: '', cvv: '' } };

function totals() {
  const sub = cartSubtotal();
  const discount = discountFor(sub);
  const afterDiscount = Math.max(0, sub - discount);
  const freeCoupon = getCoupon()?.type === 'delivery';
  const delivery = (data.method === 'pickup' || afterDiscount >= CONFIG.freeDeliveryOver || freeCoupon) ? 0 : CONFIG.deliveryFee;
  const tip = tipPct ? Math.round(afterDiscount * tipPct / 100) : 0;
  const tax = Math.round(afterDiscount * CONFIG.taxRate);
  return { sub, discount, delivery, tax, tip, total: afterDiscount + delivery + tax + tip };
}

export async function init() {
  if (!getCart().length) {
    location.replace('cart.html');
    return;
  }
  const user = getUser();
  if (user) { data.name = user.name || ''; data.email = user.email || ''; data.phone = user.phone || ''; }
  const closed = !isOpenNow().open;

  $('#main').innerHTML = `<div class="page-hero"><div class="container"><h1>${t('checkout.title')}</h1></div></div>
  <div class="container section" style="max-width:960px">
    ${closed ? `<div class="closed-notice"><i class="fa-solid fa-circle-exclamation"></i> ${t('branches.closed')} — ${t('checkout.scheduleLater')}</div>` : ''}
    <div class="wizard-steps" id="wizSteps">
      ${[['checkout.step1', 1], ['checkout.step2', 2], ['checkout.step3', 3], ['checkout.step4', 4]].map(([k, n]) => `<div class="ws ${n === 1 ? 'active' : ''}" data-step="${n}"><div class="circle">${n}</div><span>${t(k)}</span></div>`).join('')}
    </div>
    <div style="background:var(--bg-elev);border-radius:var(--radius);box-shadow:var(--shadow-sm);padding:24px">
      <div class="wizard-panel active" data-panel="1">${panelDetails()}</div>
      <div class="wizard-panel" data-panel="2">${panelDelivery()}</div>
      <div class="wizard-panel" data-panel="3">${panelPayment()}</div>
      <div class="wizard-panel" data-panel="4">${panelReview()}</div>
      <div class="wizard-nav">
        <button class="btn btn-outline" id="prevBtn" disabled><i class="fa-solid fa-arrow-left"></i> ${t('common.back')}</button>
        <button class="btn btn-primary" id="nextBtn">${t('common.continue')} <i class="fa-solid fa-arrow-right"></i></button>
      </div>
    </div>
  </div>`;

  wire();
  updateSummaryIfAny();
}

function panelDetails() {
  return `<div class="field"><label for="ckName">${t('checkout.fullName')} *</label><input id="ckName" value="${esc(data.name)}" autocomplete="name"><div class="error-msg">Please enter your name</div></div>
  <div class="field"><label for="ckPhone">${t('checkout.phone')} *</label><input id="ckPhone" value="${esc(data.phone)}" inputmode="tel" autocomplete="tel" placeholder="01xxxxxxxxx"><div class="error-msg">Enter a valid phone number</div></div>
  <div class="field"><label for="ckEmail">${t('checkout.email')} *</label><input id="ckEmail" type="email" value="${esc(data.email)}" autocomplete="email"><div class="error-msg">Enter a valid email</div></div>`;
}

function panelDelivery() {
  return `<h3>${t('checkout.deliveryMethod')}</h3>
  <div class="radio-cards" style="margin:16px 0">
    <label class="radio-card ${data.method === 'delivery' ? 'selected' : ''}" data-method="delivery"><i class="fa-solid fa-motorcycle"></i><div><strong>${t('checkout.deliveryAddr')}</strong><small>${t('checkout.deliveryDesc')} · ${CONFIG.deliveryTime}</small></div></label>
    <label class="radio-card ${data.method === 'pickup' ? 'selected' : ''}" data-method="pickup"><i class="fa-solid fa-store"></i><div><strong>${t('checkout.pickup')}</strong><small>${t('checkout.pickupDesc')}</small></div></label>
  </div>
  <div class="field" id="addrField"><label for="ckAddress">${t('checkout.address')}</label><input id="ckAddress" value="${esc(data.address)}" placeholder="${CONFIG.address}"><div class="error-msg">Address is required for delivery</div></div>
  <div class="field"><label for="ckBranch">${t('checkout.branch')}</label><select id="ckBranch">${BRANCHES.map((b) => `<option value="${b.id}" ${b.id === data.branch ? 'selected' : ''}>${b.name} — ${b.address}</option>`).join('')}</select></div>
  <h3 style="margin-top:20px">${t('checkout.schedule')}</h3>
  <div class="radio-cards" style="margin-top:12px">
    <label class="radio-card ${data.schedule === 'asap' ? 'selected' : ''}" data-sched="asap"><i class="fa-solid fa-bolt"></i><div><strong>${t('checkout.asap')}</strong><small>${CONFIG.deliveryTime}</small></div></label>
    <label class="radio-card ${data.schedule === 'later' ? 'selected' : ''}" data-sched="later"><i class="fa-regular fa-clock"></i><div><strong>${t('checkout.scheduleLater')}</strong><small>Pick a time</small></div></label>
  </div>
  <div class="field ${data.schedule === 'later' ? '' : 'hide'}" id="whenField" style="margin-top:12px"><label for="ckWhen">Time</label><input id="ckWhen" type="datetime-local" value="${data.when}"></div>`;
}

function panelPayment() {
  return `<h3>${t('checkout.payment')}</h3>
  <div class="radio-cards" style="margin:16px 0">
    <label class="radio-card ${data.payment === 'card' ? 'selected' : ''}" data-pay="card"><i class="fa-solid fa-credit-card"></i><div><strong>${t('checkout.card')}</strong><small>Visa · Mastercard</small></div></label>
    <label class="radio-card ${data.payment === 'cod' ? 'selected' : ''}" data-pay="cod"><i class="fa-solid fa-money-bill-wave"></i><div><strong>${t('checkout.cod')}</strong><small>Pay the rider</small></div></label>
    <label class="radio-card ${data.payment === 'wallet' ? 'selected' : ''}" data-pay="wallet"><i class="fa-solid fa-wallet"></i><div><strong>${t('checkout.wallet')}</strong><small>FlamePay balance</small></div></label>
  </div>
  <div id="cardFields" class="${data.payment === 'card' ? '' : 'hide'}">
    <div class="card-preview"><div class="row"><span>Flame Bites</span><i class="fa-solid fa-wifi" style="transform:rotate(90deg)"></i></div><div class="num" id="cardNumPrev">•••• •••• •••• ••••</div><div class="row"><span id="cardNamePrev">CARD HOLDER</span><span id="cardExpPrev">MM/YY</span></div></div>
    <div class="field"><label for="cNumber">${t('checkout.cardNumber')} *</label><input id="cNumber" inputmode="numeric" maxlength="19" placeholder="4242 4242 4242 4242"><div class="error-msg">Enter a valid card number</div></div>
    <div class="field"><label for="cName">${t('checkout.cardName')} *</label><input id="cName" autocomplete="cc-name"><div class="error-msg">Enter the name on card</div></div>
    <div class="flex gap-4">
      <div class="field" style="flex:1"><label for="cExp">${t('checkout.expiry')} *</label><input id="cExp" inputmode="numeric" maxlength="5" placeholder="MM/YY"><div class="error-msg">Invalid expiry</div></div>
      <div class="field" style="flex:1"><label for="cCvv">${t('checkout.cvv')} *</label><input id="cCvv" inputmode="numeric" maxlength="4" placeholder="123"><div class="error-msg">3–4 digits</div></div>
    </div>
  </div>
  <div id="codNote" class="closed-notice ${data.payment === 'cod' ? '' : 'hide'}" style="margin-top:8px"><i class="fa-solid fa-hand-holding-dollar"></i> Please have the exact amount ready.</div>`;
}

function panelReview() {
  return `<h3>${t('checkout.orderSummary')}</h3>
  <div class="review-list" id="reviewList" style="margin:16px 0"></div>
  <div id="reviewTotals"></div>`;
}

function updateSummaryIfAny() {}

function wire() {
  // Details inputs persist
  $('#ckName')?.addEventListener('input', (e) => data.name = e.target.value);
  $('#ckPhone')?.addEventListener('input', (e) => data.phone = e.target.value);
  $('#ckEmail')?.addEventListener('input', (e) => data.email = e.target.value);

  // method / schedule / payment toggles
  $$('[data-method]').forEach((c) => c.addEventListener('click', () => {
    data.method = c.dataset.method;
    $$('[data-method]').forEach((x) => x.classList.toggle('selected', x === c));
    $('#addrField').classList.toggle('hide', data.method === 'pickup');
  }));
  $$('[data-sched]').forEach((c) => c.addEventListener('click', () => {
    data.schedule = c.dataset.sched;
    $$('[data-sched]').forEach((x) => x.classList.toggle('selected', x === c));
    $('#whenField').classList.toggle('hide', data.schedule !== 'later');
  }));
  $$('[data-pay]').forEach((c) => c.addEventListener('click', () => {
    data.payment = c.dataset.pay;
    $$('[data-pay]').forEach((x) => x.classList.toggle('selected', x === c));
    $('#cardFields').classList.toggle('hide', data.payment !== 'card');
    $('#codNote').classList.toggle('hide', data.payment !== 'cod');
  }));
  $('#ckAddress')?.addEventListener('input', (e) => data.address = e.target.value);
  $('#ckBranch')?.addEventListener('change', (e) => data.branch = e.target.value);
  $('#ckWhen')?.addEventListener('change', (e) => data.when = e.target.value);

  // card formatting
  const num = $('#cNumber');
  num?.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
    $('#cardNumPrev').textContent = e.target.value || '•••• •••• •••• ••••';
    data.card.number = e.target.value.replace(/\s/g, '');
  });
  $('#cName')?.addEventListener('input', (e) => { data.card.name = e.target.value; $('#cardNamePrev').textContent = (e.target.value || 'CARD HOLDER').toUpperCase(); });
  $('#cExp')?.addEventListener('input', (e) => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (v.length > 2) v = v.slice(0, 2) + '/' + v.slice(2);
    e.target.value = v; data.card.expiry = v; $('#cardExpPrev').textContent = v || 'MM/YY';
  });
  $('#cCvv')?.addEventListener('input', (e) => { e.target.value = e.target.value.replace(/\D/g, '').slice(0, 4); data.card.cvv = e.target.value; });

  $('#prevBtn').addEventListener('click', () => go(step - 1));
  $('#nextBtn').addEventListener('click', onNext);
  addEventListener('keydown', (e) => { if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA' && document.querySelector('.modal-backdrop.open') === null) { e.preventDefault(); onNext(); } });
}

function onNext() {
  if (!validate(step)) return;
  if (step === 4) { placeOrder(); return; }
  go(step + 1);
}

function go(n) {
  step = Math.max(1, Math.min(4, n));
  $$('.wizard-panel').forEach((p) => p.classList.toggle('active', Number(p.dataset.panel) === step));
  $$('.ws').forEach((w) => {
    const s = Number(w.dataset.step);
    w.classList.toggle('active', s === step);
    w.classList.toggle('done', s < step);
    w.querySelector('.circle').innerHTML = s < step ? '<i class="fa-solid fa-check"></i>' : String(s);
  });
  $('#prevBtn').disabled = step === 1;
  $('#nextBtn').innerHTML = step === 4 ? `<i class="fa-solid fa-lock"></i> ${t('checkout.placeOrder')}` : `${t('common.continue')} <i class="fa-solid fa-arrow-right"></i>`;
  if (step === 4) buildReview();
  scrollTo({ top: $('.wizard-steps').offsetTop - 120, behavior: 'smooth' });
}

function invalid(id, bad) {
  const field = $('#' + id).closest('.field');
  field.classList.toggle('invalid', bad);
  return !bad;
}

function luhn(numStr) {
  const s = numStr.replace(/\s/g, '');
  if (s.length < 13) return false;
  let sum = 0, alt = false;
  for (let i = s.length - 1; i >= 0; i--) {
    let d = parseInt(s[i], 10);
    if (alt) { d *= 2; if (d > 9) d -= 9; }
    sum += d; alt = !alt;
  }
  return sum % 10 === 0;
}

function validate(s) {
  if (s === 1) {
    let ok = true;
    ok = invalid('ckName', data.name.trim().length < 2) && ok;
    ok = invalid('ckPhone', !/^[0-9+\s-]{8,}$/.test(data.phone.trim())) && ok;
    ok = invalid('ckEmail', !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) && ok;
    if (!ok) toast('Please fix the highlighted fields', 'error');
    return ok;
  }
  if (s === 2) {
    let ok = true;
    if (data.method === 'delivery') ok = invalid('ckAddress', data.address.trim().length < 5) && ok;
    if (data.schedule === 'later' && !data.when) { toast('Please pick a time', 'error'); ok = false; }
    if (!ok) toast('Please complete delivery details', 'error');
    return ok;
  }
  if (s === 3) {
    if (data.payment !== 'card') return true;
    let ok = true;
    ok = invalid('cNumber', !luhn(data.card.number)) && ok;
    ok = invalid('cName', data.card.name.trim().length < 2) && ok;
    const expOk = /^(0[1-9]|1[0-2])\/\d{2}$/.test(data.card.expiry);
    ok = invalid('cExp', !expOk) && ok;
    ok = invalid('cCvv', !/^\d{3,4}$/.test(data.card.cvv)) && ok;
    if (!ok) toast('Please check your card details', 'error');
    return ok;
  }
  return true;
}

function buildReview() {
  const cart = getCart();
  const T = totals();
  const list = $('#reviewList');
  list.innerHTML = '';
  cart.forEach((l) => list.append(buildLine(l)));
  const branch = BRANCHES.find((b) => b.id === data.branch);
  $('#reviewTotals').innerHTML = `
    <div class="summary-row"><span>${t('common.subtotal')} (${cartCount()})</span><span>${money(T.sub)}</span></div>
    ${T.discount ? `<div class="summary-row"><span>${t('common.discount')}</span><span style="color:var(--red-bright)">− ${money(T.discount)}</span></div>` : ''}
    <div class="summary-row"><span>${t('common.delivery')}</span><span>${T.delivery === 0 ? 'FREE' : money(T.delivery)}</span></div>
    <div class="summary-row"><span>${t('common.tax')}</span><span>${money(T.tax)}</span></div>
    <div class="summary-row total"><span>${t('common.total')}</span><span>${money(T.total)}</span></div>
    <div class="review-list" style="margin-top:16px">
      <div class="rl-row"><span class="lbl">${t('checkout.fullName')}</span><strong>${esc(data.name)}</strong></div>
      <div class="rl-row"><span class="lbl">${t('checkout.phone')}</span><strong>${esc(data.phone)}</strong></div>
      <div class="rl-row"><span class="lbl">${t('checkout.deliveryMethod')}</span><strong>${data.method === 'pickup' ? t('checkout.pickup') : t('checkout.deliveryAddr')}</strong></div>
      ${data.method === 'delivery' ? `<div class="rl-row"><span class="lbl">${t('checkout.address')}</span><strong>${esc(data.address)}</strong></div>` : ''}
      <div class="rl-row"><span class="lbl">${t('checkout.branch')}</span><strong>${esc(branch.name)}</strong></div>
      <div class="rl-row"><span class="lbl">${t('checkout.payment')}</span><strong>${data.payment === 'card' ? '•••• ' + data.card.number.slice(-4) : data.payment === 'cod' ? t('checkout.cod') : t('checkout.wallet')}</strong></div>
    </div>`;
}

function placeOrder() {
  const T = totals();
  const branch = BRANCHES.find((b) => b.id === data.branch);
  const order = {
    orderNo: orderNumber(), date: Date.now(), status: 'received',
    items: getCart().map((l) => ({ ...l })),
    totals: T, details: { ...data }, branch: branch.name,
    method: data.method, payment: data.payment
  };
  addOrder(order);
  clearCart();
  clearCoupon();
  // simulate progress timers persisted for the success page
  toast(t('toast.orderPlaced'), 'success');
  location.href = `order-success.html?order=${order.orderNo}`;
}
