/** Order success page: confetti + animated simulated tracker. */
import { $, el, param } from '../core/utils.js';
import { t } from '../core/i18n.js';
import { money } from '../core/currency.js';
import { getOrder, updateOrderStatus } from '../core/store.js';

const STEPS = [['success.received', 'fa-clipboard-check', 0], ['success.preparing', 'fa-utensils', 4000], ['success.onTheWay', 'fa-motorcycle', 9000], ['success.delivered', 'fa-house-circle-check', 15000]];
const STATUS = ['received', 'preparing', 'on-the-way', 'delivered'];

export async function init() {
  const orderNo = param('order');
  const order = orderNo ? getOrder(orderNo) : null;

  $('#main').innerHTML = `<div class="container section text-center">
    <div class="reveal in" style="max-width:640px;margin:0 auto">
      <div style="font-size:4rem">🎉</div>
      <h1>${t('success.title')}</h1>
      <p class="muted">${t('success.sub')}</p>
      ${order ? `<p class="mt-2">${t('success.orderNo')}: <strong style="font-family:var(--font-head);font-size:1.3rem;color:var(--red-primary)">#${order.orderNo}</strong></p>
      <p class="muted">${order.items.length} items · ${money(order.totals.total)} · ${order.method === 'pickup' ? t('checkout.pickup') : t('checkout.deliveryAddr')}</p>` : ''}
    </div>
    <div class="tracker" id="tracker" style="max-width:820px;margin-inline:auto"></div>
    <div class="flex gap-3" style="justify-content:center;margin-top:32px">
      <a class="btn btn-primary" href="menu.html"><i class="fa-solid fa-book-open"></i> ${t('success.keepShopping')}</a>
      <a class="btn btn-outline" href="account.html"><i class="fa-solid fa-receipt"></i> ${t('success.viewOrder')}</a>
    </div>
  </div>`;

  render(0);
  confetti();
  STEPS.forEach(([, , delay], i) => {
    if (i === 0) return;
    setTimeout(() => {
      render(i);
      if (order) updateOrderStatus(order.orderNo, STATUS[i]);
      if (i === STEPS.length - 1) confetti();
    }, delay);
  });

  function render(current) {
    const track = $('#tracker');
    track.innerHTML = STEPS.map(([k, ic], i) => `<div class="tk ${i < current ? 'done' : i === current ? 'current' : ''}"><div class="ic"><i class="fa-solid ${ic}"></i></div><strong>${t(k)}</strong><small>${i < current ? '✓' : i === current ? 'In progress' : 'Pending'}</small></div>`).join('');
  }
}

function confetti() {
  const wrap = el('div', { class: 'confetti' });
  const colors = ['#DA291C', '#FFC72C', '#FF8200', '#E4002B', '#FFFFFF'];
  for (let i = 0; i < 80; i++) {
    const c = el('i');
    c.style.left = Math.random() * 100 + 'vw';
    c.style.background = colors[(Math.random() * colors.length) | 0];
    c.style.animationDuration = (2 + Math.random() * 2) + 's';
    c.style.animationDelay = Math.random() * 0.6 + 's';
    wrap.append(c);
  }
  document.body.append(wrap);
  setTimeout(() => wrap.remove(), 5000);
}
