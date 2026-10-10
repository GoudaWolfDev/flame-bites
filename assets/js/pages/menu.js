/** Menu page: tabs, filters, sort, view toggle, URL state + scroll-spy. */
import { $, $$, el, debounce, param, setParams, esc } from '../core/utils.js';
import { t } from '../core/i18n.js';
import { CATEGORIES } from '../data/categories.js';
import { MENU, CATEGORY_ORDER } from '../data/menu.js';
import { renderCard } from '../components/card.js';

const state = {
  cat: 'all', sort: 'popular', q: '', veg: false, spicy: false,
  price: 500, rating: 0, view: 'grid'
};

function readState() {
  state.cat = param('cat') || 'all';
  state.sort = param('sort') || 'popular';
  state.q = param('q') || '';
  state.veg = param('veg') === '1';
  state.spicy = param('spicy') === '1';
  state.price = Number(param('price')) || 500;
  state.rating = Number(param('rating')) || 0;
  state.view = param('view') || 'grid';
}

function writeState() {
  setParams({
    cat: state.cat === 'all' ? '' : state.cat, sort: state.sort, q: state.q,
    veg: state.veg ? '1' : '', spicy: state.spicy ? '1' : '',
    price: state.price >= 500 ? '' : state.price, rating: state.rating || '', view: state.view
  });
}

function sortItems(items) {
  const s = [...items];
  switch (state.sort) {
    case 'price-asc': return s.sort((a, b) => a.price - b.price);
    case 'price-desc': return s.sort((a, b) => b.price - a.price);
    case 'rating': return s.sort((a, b) => b.rating - a.rating);
    case 'newest': return s.sort((a, b) => (b.isNew - a.isNew) || (b.reviewsCount - a.reviewsCount));
    default: return s.sort((a, b) => (b.isBestSeller - a.isBestSeller) || (b.reviewsCount - a.reviewsCount));
  }
}

function filterItems() {
  const q = state.q.trim().toLowerCase();
  return MENU.filter((m) => {
    if (state.cat !== 'all' && m.category !== state.cat) return false;
    if (state.veg && !m.isVeg) return false;
    if (state.spicy && !m.isSpicy) return false;
    if (m.price > state.price) return false;
    if (state.rating && m.rating < state.rating) return false;
    if (q && !(m.name.toLowerCase().includes(q) || m.description.toLowerCase().includes(q) || m.ingredients.some((i) => i.toLowerCase().includes(q)))) return false;
    return true;
  });
}

export async function init() {
  readState();

  const main = $('#main');
  if (main) {
    main.innerHTML = `
    <div class="page-hero">
      <div class="container">
        <h1>${t('nav.menu')}</h1>
        <p>${t('home.bestsellersSub')}</p>
      </div>
    </div>
    <div class="menu-toolbar">
      <div class="container">
        <div class="cat-tabs" id="catTabs"></div>
      </div>
    </div>
    <div class="container section">
      <div class="filter-bar">
        <div class="search-box" style="max-width:300px;flex:1">
          <i class="fa-solid fa-magnifying-glass"></i>
          <input type="search" id="menuSearch" placeholder="${t('common.search')}…" autocomplete="off">
        </div>
        <button class="btn btn-outline btn-sm" id="filterToggle"><i class="fa-solid fa-sliders"></i> ${t('common.filter')}</button>
        <select id="sortSelect" aria-label="Sort">
          <option value="popular">${t('common.popular')}</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Top Rated</option>
          <option value="newest">Newest</option>
        </select>
        <div class="view-toggle" id="viewToggle">
          <button data-view="grid" class="active" aria-label="Grid view"><i class="fa-solid fa-border-all"></i></button>
          <button data-view="list" aria-label="List view"><i class="fa-solid fa-list"></i></button>
        </div>
        <span class="results-count" id="resultsCount">0 items</span>
      </div>

      <div class="adv-filters" id="advFilters">
        <div class="filter-group">
          <h4>${t('common.diet')}</h4>
          <label class="flex center gap-2"><input type="checkbox" id="vegToggle"> ${t('common.vegetarian')}</label>
          <label class="flex center gap-2 mt-2"><input type="checkbox" id="spicyToggle"> ${t('common.spicy')}</label>
        </div>
        <div class="filter-group">
          <h4>Max Price: <span id="priceLabel">EGP 500</span></h4>
          <input type="range" id="priceRange" min="20" max="500" step="10" value="500">
        </div>
        <div class="filter-group">
          <h4>${t('common.minRating')}</h4>
          <select id="ratingSelect">
            <option value="0">All Ratings</option>
            <option value="4.5">4.5+ Stars</option>
            <option value="4">4.0+ Stars</option>
            <option value="3">3.0+ Stars</option>
          </select>
        </div>
        <div class="filter-group flex center" style="align-items:flex-end">
          <button class="btn btn-ghost btn-sm" id="clearFilters">${t('common.clearFilters')}</button>
        </div>
      </div>

      <div id="noResults" class="empty-state hide">
        <div class="icon"><i class="fa-solid fa-utensils"></i></div>
        <h2>No items found</h2>
        <p>Try resetting filters or search term.</p>
      </div>

      <div class="grid menu-grid" id="menuGrid"></div>
    </div>`;
  }

  const grid = $('#menuGrid');
  const tabs = $('#catTabs');
  const noRes = $('#noResults');
  const countEl = $('#resultsCount');

  // category tabs
  tabs.innerHTML = `<button data-cat="all" class="${state.cat === 'all' ? 'active' : ''}">${t('nav.menu')} · ${t('common.popular')}</button>` +
    CATEGORIES.map((c) => `<button data-cat="${c.id}" data-i18n-btn="${c.id}" class="${state.cat === c.id ? 'active' : ''}">${c.name}</button>`).join('');

  tabs.addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    state.cat = b.dataset.cat;
    $$('button', tabs).forEach((x) => x.classList.toggle('active', x === b));
    render();
  });

  // controls
  const sortSel = $('#sortSelect');
  sortSel.value = state.sort;
  sortSel.addEventListener('change', () => { state.sort = sortSel.value; render(); });

  const veg = $('#vegToggle'); veg.checked = state.veg;
  veg.addEventListener('change', () => { state.veg = veg.checked; render(); });
  const spicy = $('#spicyToggle'); spicy.checked = state.spicy;
  spicy.addEventListener('change', () => { state.spicy = spicy.checked; render(); });
  const price = $('#priceRange'); price.value = state.price;
  const priceLabel = $('#priceLabel');
  const onPrice = () => { state.price = Number(price.value); priceLabel.textContent = `EGP ${state.price}`; render(); };
  price.addEventListener('input', debounce(onPrice, 200));
  const ratingSel = $('#ratingSelect'); ratingSel.value = String(state.rating);
  ratingSel.addEventListener('change', () => { state.rating = Number(ratingSel.value); render(); });

  const qInput = $('#menuSearch');
  if (qInput) { qInput.value = state.q; qInput.addEventListener('input', debounce(() => { state.q = qInput.value; render(); }, 220)); }

  $('#filterToggle')?.addEventListener('click', () => $('#advFilters').classList.toggle('open'));
  $$('#viewToggle button').forEach((b) => {
    b.classList.toggle('active', b.dataset.view === state.view);
    b.addEventListener('click', () => { state.view = b.dataset.view; $$('#viewToggle button').forEach((x) => x.classList.toggle('active', x === b)); render(); });
  });

  $('#clearFilters')?.addEventListener('click', () => {
    Object.assign(state, { cat: 'all', sort: 'popular', q: '', veg: false, spicy: false, price: 500, rating: 0 });
    sortSel.value = 'popular'; veg.checked = false; spicy.checked = false; price.value = 500; priceLabel.textContent = 'EGP 500'; ratingSel.value = '0';
    if (qInput) qInput.value = '';
    $$('button', tabs).forEach((x) => x.classList.toggle('active', x.dataset.cat === 'all'));
    render();
  });

  render();
  window.addEventListener('scroll', spy, { passive: true });

  function render() {
    const items = sortItems(filterItems());
    grid.className = `grid menu-grid ${state.view === 'list' ? 'list-view' : ''}`;
    grid.innerHTML = '';
    countEl.textContent = `${items.length} ${t('common.results')}`;

    if (!items.length) { noRes.classList.remove('hide'); writeState(); return; }
    noRes.classList.add('hide');

    if (state.cat === 'all') {
      CATEGORY_ORDER.forEach((cid) => {
        const group = items.filter((m) => m.category === cid);
        if (!group.length) return;
        const cat = CATEGORIES.find((c) => c.id === cid);
        grid.append(el('h2', { class: 'menu-cat-title', id: `cat-${cid}`, style: 'grid-column:1/-1;margin:16px 0 0;scroll-margin-top:140px', html: `${cat.emoji} ${cat.name} <span class="muted" style="font-size:.6em">(${group.length})</span>` }));
        group.forEach((m) => grid.append(renderCard(m)));
      });
    } else {
      items.forEach((m) => grid.append(renderCard(m)));
    }
    writeState();
  }

  function spy() {
    if (state.cat !== 'all') return;
    const y = window.scrollY + 200;
    let current = null;
    $$('.menu-cat-title').forEach((h) => { if (h.offsetTop <= y) current = h.id.replace('cat-', ''); });
    if (current) tabs.querySelectorAll('button').forEach((b) => b.classList.toggle('active', b.dataset.cat === current));
  }
}
