/** Branches page. */
import { $, el, isOpenNow } from '../core/utils.js';
import { t } from '../core/i18n.js';
import { BRANCHES } from '../data/branches.js';

export async function init() {
  $('#main').innerHTML = `<div class="page-hero"><div class="container"><h1>${t('branches.title')}</h1><p>${t('branches.sub')}</p></div></div>
  <div class="container section"><div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(320px,1fr))" id="branchGrid"></div></div>`;
  const status = isOpenNow();
  const grid = $('#branchGrid');
  BRANCHES.forEach((b) => {
    grid.append(el('div', { class: 'branch-card reveal' },
      el('iframe', { src: b.map, title: `${b.name} map`, loading: 'lazy' }),
      el('div', { class: 'bc-body' },
        el('div', { class: 'flex between center' }, el('h3', { style: 'margin:0' }, b.name),
          el('span', { class: `badge ${status.open ? 'badge-open' : 'badge-closed'}` }, status.open ? t('branches.open') : t('branches.closed'))),
        el('div', { class: 'bc-row mt-2' }, el('i', { class: 'fa-solid fa-location-dot' }), b.address),
        el('div', { class: 'bc-row' }, el('i', { class: 'fa-regular fa-clock' }), b.hours),
        el('div', { class: 'bc-row' }, el('i', { class: 'fa-solid fa-phone' }), el('a', { href: `tel:${b.phone.replace(/\s/g, '')}` }, b.phone)),
        el('div', { class: 'flex gap-3 mt-4' },
          el('a', { class: 'btn btn-primary btn-sm', href: b.directions, target: '_blank', rel: 'noopener' }, el('i', { class: 'fa-solid fa-diamond-turn-right' }), t('branches.directions')),
          el('a', { class: 'btn btn-outline btn-sm', href: `tel:${b.phone.replace(/\s/g, '')}` }, el('i', { class: 'fa-solid fa-phone' }), t('branches.call'))))));
  });
}
