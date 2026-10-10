/** Slide-over mini cart, shared line renderer + drawer mount. */
import { el, esc, img, scrollLock } from '../core/utils.js';
import { money } from '../core/currency.js';
import { t } from '../core/i18n.js';
import { getCart, cartSubtotal, cartCount, updateQty, removeFromCart, on, discountFor, getCoupon } from '../core/store.js';
import { toast } from './toast.js';

/** Render a single cart line (used by drawer + cart page). */
export function buildLine(line, { onRemove } = {}) {
  const opts = [];
  if (line.size) opts.push(line.size);
  if (line.extras && line.extras.length) opts.push(line.extras.map((e) => e.name).join(', '));
  if (line.spice) opts.push('🌶 ' + line.spice);
  const item = el('div', { class: 'cart-item', dataset: { key: line.key } },
    el('img', { src: img(line.image.split('photo-')[1].split('?')[0], 200), alt: line.name, loading: 'lazy' }),
    el('div', {},
      el('a', { class: 'ci-name', href: `item.html?id=${line.id}` }, line.name),
      opts.length ? el('div', { class: 'ci-opts', html: esc(opts.join(' · ')) }) : null,
      line.notes ? el('div', { class: 'ci-opts', html: `<i class="fa-regular fa-note-sticky"></i> ${esc(line.notes)}` }) : null
    ),
    el('div', { class: 'ci-controls' },
      el('div', { class: 'stepper' },
        el('button', { 'aria-label': 'Decrease', onclick: () => { line.qty > 1 ? updateQty(line.key, line.qty - 1) : removeFromCart(line.key); } }, '−'),
        el('span', { class: 'qty' }, String(line.qty)),
        el('button', { 'aria-label': 'Increase', onclick: () => updateQty(line.key, line.qty + 1) }, '+')
      ),
      el('div', { class: 'price' }, money((line.basePrice + (line.extras || []).reduce((s, e) => s + e.price, 0)) * line.qty)),
      el('button', { class: 'ci-remove', onclick: () => { removeFromCart(line.key); onRemove && onRemove(); } }, el('i', { class: 'fa-solid fa-trash' }), ' ' + t('common.remove'))
    )
  );
  return item;
}

let backdrop, drawer, listEl, footEl;

/** Create and keep the drawer in sync with the cart. */
export function mountCartDrawer() {
  if (backdrop) return;
  backdrop = el('div', { class: 'drawer-backdrop', onclick: closeCartDrawer });
  drawer = el('aside', { class: 'drawer', dir: document.documentElement.dir, 'aria-label': 'Mini cart' },
    el('div', { class: 'drawer-head' },
      el('h3', { style: 'margin:0' }, el('i', { class: 'fa-solid fa-bag-shopping' }), ' ' + t('nav.cart')),
      el('button', { class: 'icon-btn', 'aria-label': 'Close cart', onclick: closeCartDrawer }, el('i', { class: 'fa-solid fa-xmark' }))
    ),
    listEl = el('div', { style: 'flex:1;overflow:auto;padding:0 16px' }),
    footEl = el('div', { style: 'padding:16px;border-top:1px solid var(--border)' })
  );
  document.body.append(backdrop, drawer);
  on('cart:change', render);
  render();
}

function render() {
  if (!mountCartDrawerReady()) return;
  const cart = getCart();
  listEl.innerHTML = '';
  if (!cart.length) {
    listEl.append(el('div', { class: 'empty-state' },
      el('div', { class: 'icon' }, el('i', { class: 'fa-solid fa-bag-shopping' })),
      el('h3', {}, t('common.empty')), el('p', {}, t('common.emptyDesc')),
      el('a', { class: 'btn btn-primary', href: 'menu.html', onclick: closeCartDrawer }, t('common.viewMenu'))));
    footEl.innerHTML = '';
    return;
  }
  cart.forEach((l) => listEl.append(buildLine(l)));
  const sub = cartSubtotal();
  const discount = discountFor(sub);
  footEl.innerHTML = '';
  footEl.append(
    el('div', { class: 'summary-row' }, el('span', {}, t('common.subtotal')), el('strong', {}, money(sub))),
    discount ? el('div', { class: 'summary-row' }, el('span', {}, t('common.discount')), el('strong', { style: 'color:var(--red-bright)' }, '− ' + money(discount))) : null,
    el('a', { class: 'btn btn-primary btn-block mt-4', href: 'checkout.html', onclick: closeCartDrawer },
      el('i', { class: 'fa-solid fa-lock' }), t('common.checkout')),
    el('a', { class: 'btn btn-outline btn-block mt-2', href: 'cart.html', onclick: closeCartDrawer }, t('nav.cart'))
  );
}

function mountCartDrawerReady() { return !!(listEl && footEl); }

export function openCartDrawer() {
  mountCartDrawer();
  backdrop.classList.add('open');
  drawer.classList.add('open');
  scrollLock(true);
}
export function closeCartDrawer() {
  if (!backdrop) return;
  backdrop.classList.remove('open');
  drawer.classList.remove('open');
  scrollLock(false);
}
export function toggleCartDrawer() {
  drawer && drawer.classList.contains('open') ? closeCartDrawer() : openCartDrawer();
}
