/** Menu item card renderer shared by home, menu and item pages. */
import { el, esc, lazyImg, starsHTML, img } from '../core/utils.js';
import { money } from '../core/currency.js';
import { t } from '../core/i18n.js';
import { getCart, addToCart, updateQty, removeFromCart, isFavorite, toggleFavorite, on } from '../core/store.js';
import { toast } from './toast.js';
import { openModal, closeModal } from './modal.js';

const baseSize = (item) => (item.sizes && item.sizes.length ? item.sizes[0].name : '');
const basePrice = (item) => (item.sizes && item.sizes.length ? item.sizes[0].price : item.price);
const baseKey = (item) => [item.id, baseSize(item), '', '', ''].join('::');

function badgeHTML(item) {
  const b = [];
  if (item.isSpicy) b.push('<span class="badge badge-spicy"><i class="fa-solid fa-fire"></i> ' + t('common.spicy') + '</span>');
  if (item.isNew) b.push('<span class="badge badge-new">' + t('common.new') + '</span>');
  if (item.isBestSeller) b.push('<span class="badge badge-best">' + t('common.bestseller') + '</span>');
  if (item.oldPrice) b.push('<span class="badge badge-sale">-' + Math.round((1 - item.price / item.oldPrice) * 100) + '%</span>');
  if (item.isVeg) b.push('<span class="badge badge-veg">' + t('common.vegetarian') + '</span>');
  return b.join('');
}

function addConfig(item) {
  return {
    id: item.id, name: item.name, image: item.images[0],
    basePrice: basePrice(item), size: baseSize(item), extras: [], notes: '', spice: ''
  };
}

function stepper(item, refresh) {
  const wrap = el('div', { class: 'stepper' });
  function draw() {
    const line = getCart().find((l) => l.key === baseKey(item));
    const qty = line ? line.qty : 0;
    wrap.innerHTML = qty
      ? `<button data-act="dec" aria-label="Decrease">−</button><span class="qty">${qty}</span><button data-act="inc" aria-label="Increase">+</button>`
      : '';
  }
  wrap.addEventListener('click', (e) => {
    const btn = e.target.closest('button'); if (!btn) return;
    const line = getCart().find((l) => l.key === baseKey(item));
    if (btn.dataset.act === 'inc') { line ? updateQty(line.key, line.qty + 1) : addToCart(addConfig(item), 1); }
    else if (line) { line.qty > 1 ? updateQty(line.key, line.qty - 1) : removeFromCart(line.key); }
    draw(); refresh && refresh();
  });
  draw();
  return wrap;
}

/**
 * @param {object} item
 * @param {{list?:boolean, reveal?:boolean}} [opts]
 */
export function renderCard(item, opts = {}) {
  const fav = isFavorite(item.id);
  const card = el('article', { class: 'card' + (opts.reveal ? ' reveal' : ''), dataset: { id: item.id } });

  const media = el('div', { class: 'card-media' },
    lazyImg(img(item.images[0].split('photo-')[1].split('?')[0]), item.name),
    el('div', { class: 'badges', html: badgeHTML(item) }),
    el('button', { class: 'card-fav' + (fav ? ' active' : ''), 'aria-label': t('common.favorite'), dataset: { fav: item.id } },
      el('i', { class: `fa-${fav ? 'solid' : 'regular'} fa-heart` })),
    el('button', { class: 'card-quick', 'aria-label': t('common.quickView') }, el('i', { class: 'fa-solid fa-eye' }))
  );

  const foot = el('div', { class: 'card-foot' });
  const priceEl = el('div', { class: 'card-price', html: `${item.sizes && item.sizes.length ? `<small class="muted" style="font-size:.6em">${t('common.from')} </small>` : ''}${money(basePrice(item))}${item.oldPrice ? `<span class="old-price">${money(item.oldPrice)}</span>` : ''}` });

  const addBtn = el('button', { class: 'btn btn-primary btn-sm' }, el('i', { class: 'fa-solid fa-plus' }), t('common.add'));
  const step = el('div');

  function refresh() {
    const line = getCart().find((l) => l.key === baseKey(item));
    if (line) { addBtn.classList.add('hide'); step.classList.remove('hide'); }
    else { addBtn.classList.remove('hide'); step.classList.add('hide'); }
  }

  addBtn.addEventListener('click', () => {
    addToCart(addConfig(item), 1);
    toast(`${esc(item.name)} — ${t('toast.added')}`, 'success');
  });
  step.append(stepper(item, refresh));
  foot.append(priceEl, addBtn, step);
  refresh();

  const body = el('div', { class: 'card-body' },
    el('h3', {}, el('a', { href: `item.html?id=${item.id}` }, item.name)),
    starsHTML(item.rating),
    el('p', { class: 'card-desc' }, item.description),
    el('div', { class: 'card-meta' },
      el('span', {}, `<i class="fa-solid fa-fire-flame-curved"></i> ${item.calories} kcal`),
      el('span', {}, `<i class="fa-regular fa-clock"></i> ${item.prepTime} ${t('common.min')}`)),
    foot
  );

  card.append(media, body);

  // favorite
  card.querySelector('.card-fav').addEventListener('click', (e) => {
    const on_ = toggleFavorite(item.id);
    e.currentTarget.classList.toggle('active', on_);
    e.currentTarget.querySelector('i').className = `fa-${on_ ? 'solid' : 'regular'} fa-heart`;
    toast(on_ ? t('toast.favAdded') : t('toast.favRemoved'), 'info');
  });
  // quick view
  card.querySelector('.card-quick').addEventListener('click', () => quickView(item));

  return card;
}

/** Quick view modal for a menu item. */
export function quickView(item) {
  const body = el('div', { class: 'split', style: 'gap:24px;align-items:start' },
    el('div', { style: 'border-radius:16px;overflow:hidden' }, lazyImg(img(item.images[0].split('photo-')[1].split('?')[0], 700), item.name)),
    el('div', {},
      el('h2', { style: 'margin-bottom:6px' }, item.name),
      starsHTML(item.rating),
      el('p', { class: 'muted', style: 'margin:10px 0' }, item.description),
      el('div', { class: 'card-meta', style: 'margin-bottom:14px' },
        el('span', {}, `<i class="fa-solid fa-fire-flame-curved"></i> ${item.calories} kcal`),
        el('span', {}, `<i class="fa-regular fa-clock"></i> ${item.prepTime} ${t('common.min')}`)),
      el('div', { class: 'card-price', style: 'font-size:1.6rem', html: `${money(basePrice(item))}${item.oldPrice ? `<span class="old-price">${money(item.oldPrice)}</span>` : ''}` }),
      el('div', { class: 'flex gap-3 mt-4' },
        el('a', { class: 'btn btn-outline', href: `item.html?id=${item.id}` }, t('common.viewMenu')),
        el('button', { class: 'btn btn-primary', onclick: () => {
          addToCart(addConfig(item), 1);
          toast(`${esc(item.name)} — ${t('toast.added')}`, 'success');
          closeModal();
        } }, el('i', { class: 'fa-solid fa-cart-plus' }), t('common.addToCart')))
    )
  );
  openModal({ title: '', body, wide: true });
}
