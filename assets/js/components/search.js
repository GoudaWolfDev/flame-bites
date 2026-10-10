/** Live menu search with debounced autocomplete + keyboard navigation. */
import { MENU } from '../data/menu.js';
import { money } from '../core/currency.js';
import { t } from '../core/i18n.js';
import { el, debounce, esc, img } from '../core/utils.js';

/**
 * Wire an input + results panel into a working autocomplete.
 * @param {HTMLInputElement} input
 * @param {HTMLElement} panel
 */
export function initSearch(input, panel) {
  if (!input || !panel) return;
  let active = -1, results = [];

  function close() { panel.classList.remove('open'); active = -1; }

  function renderList(q) {
    const query = q.trim().toLowerCase();
    if (!query) {
      panel.innerHTML = `<div class="ac-head">${t('search.suggestions')}</div>`;
      results = MENU.filter((m) => m.isBestSeller).slice(0, 5);
    } else {
      results = MENU.filter((m) =>
        m.name.toLowerCase().includes(query) ||
        m.category.toLowerCase().includes(query) ||
        m.ingredients.some((i) => i.toLowerCase().includes(query))
      ).slice(0, 8);
    }
    if (!results.length) {
      panel.innerHTML = `<div class="ac-empty"><i class="fa-solid fa-face-sad-tear"></i> ${t('search.noResults')}</div>`;
      panel.classList.add('open');
      return;
    }
    const head = query ? '' : `<div class="ac-head">${t('search.suggestions')}</div>`;
    panel.innerHTML = head + results.map((m, i) => {
      const name = query ? esc(m.name).replace(new RegExp(`(${esc(query)})`, 'ig'), '<mark>$1</mark>') : esc(m.name);
      return `<a class="ac-item" href="item.html?id=${m.id}" data-i="${i}" role="option">
        <img src="${img(m.images[0].split('photo-')[1].split('?')[0])}" alt="${esc(m.name)}" loading="lazy">
        <span class="info"><strong>${name}</strong><small class="muted">${esc(m.category)}</small></span>
        <span class="price">${money(m.price)}</span></a>`;
    }).join('');
    panel.classList.add('open');
  }

  input.addEventListener('input', debounce((e) => renderList(e.target.value), 180));
  input.addEventListener('focus', () => renderList(input.value));
  input.addEventListener('keydown', (e) => {
    const items = panel.querySelectorAll('.ac-item');
    if (e.key === 'ArrowDown') { e.preventDefault(); active = Math.min(active + 1, items.length - 1); highlight(items); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); active = Math.max(active - 1, 0); highlight(items); }
    else if (e.key === 'Enter' && active >= 0 && items[active]) { items[active].click(); }
    else if (e.key === 'Escape') { close(); input.blur(); }
  });
  document.addEventListener('click', (e) => { if (!panel.contains(e.target) && e.target !== input) close(); });

  function highlight(items) {
    items.forEach((it, i) => it.classList.toggle('active', i === active));
    if (items[active]) items[active].scrollIntoView({ block: 'nearest' });
  }
}
