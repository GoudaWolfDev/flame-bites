/** Item detail page: gallery, options, live pricing, reviews, upsells. */
import { $, $$, el, param, esc, img, starsHTML } from '../core/utils.js';
import { t } from '../core/i18n.js';
import { money } from '../core/currency.js';
import { byId, MENU } from '../data/menu.js';
import { getReviews, addReview, getRecent, pushRecent, addToCart } from '../core/store.js';
import { renderCard } from '../components/card.js';
import { toast } from '../components/toast.js';
import { openModal, closeModal } from '../components/modal.js';

const SPICE = ['Mild', 'Medium', 'Hot', 'Extra Hot'];

export async function init() {
  const id = param('id');
  const item = byId(id);
  if (!item) { location.replace('404.html'); return; }
  pushRecent(id);

  const main = $('#main');
  const sizes = item.sizes && item.sizes.length ? item.sizes : null;
  let sizeName = sizes ? sizes[0].name : '';
  let sizePrice = sizes ? sizes[0].price : item.price;
  let extras = [];
  let spice = 'Mild';
  let qty = 1;

  main.innerHTML = `<div class="container section">
    <nav class="breadcrumbs" aria-label="Breadcrumb" style="background:none;padding:0 0 20px">
      <ol><li><a href="index.html">${t('page.home')}</a></li><li><a href="menu.html">${t('page.menu')}</a></li><li><a href="menu.html?cat=${item.category}">${esc(item.category)}</a></li><li aria-current="page">${esc(item.name)}</li></ol>
    </nav>
    <div class="split" style="grid-template-columns:1.05fr 1fr;gap:40px;align-items:start" id="itemLayout">
      <div class="item-gallery">
        <div class="gallery-main"><img id="galleryMain" src="${img(item.images[0].split('photo-')[1].split('?')[0], 900)}" alt="${esc(item.name)}"></div>
        <div class="gallery-thumbs" id="thumbs">
          ${item.images.map((im, i) => `<img src="${img(im.split('photo-')[1].split('?')[0], 200)}" data-src="${img(im.split('photo-')[1].split('?')[0], 1200)}" alt="${esc(item.name)} view ${i + 1}" class="${i === 0 ? 'active' : ''}" loading="lazy">`).join('')}
        </div>
      </div>
      <div id="itemInfo">
        <div class="flex center gap-2 wrap" style="margin-bottom:10px">${item.isBestSeller ? `<span class="badge badge-best">${t('common.bestseller')}</span>` : ''}${item.isNew ? `<span class="badge badge-new">${t('common.new')}</span>` : ''}${item.isSpicy ? `<span class="badge badge-spicy"><i class="fa-solid fa-fire"></i> ${t('common.spicy')}</span>` : ''}${item.isVeg ? `<span class="badge badge-veg">${t('common.vegetarian')}</span>` : ''}</div>
        <h1 style="margin-bottom:6px">${esc(item.name)}</h1>
        ${starsHTML(item.rating)} <a href="#reviewsTab" class="muted" style="font-size:.85rem">(${item.reviewsCount} ${t('item.reviewsCount')})</a>
        <div class="card-meta" style="margin:12px 0">
          <span><i class="fa-solid fa-fire-flame-curved"></i> ${item.calories} ${t('common.calories')}</span>
          <span><i class="fa-regular fa-clock"></i> ${item.prepTime} ${t('common.min')}</span>
          <span><i class="fa-solid fa-circle-check" style="color:#2e7d32"></i> ${item.available ? t('common.available') : t('common.unavailable')}</span>
        </div>
        <p class="muted">${esc(item.description)}</p>
        <div class="price" id="unitPrice" style="font-size:2rem;font-family:var(--font-head);color:var(--red-deep)">${money(sizePrice)}${item.oldPrice ? `<span class="old-price">${money(item.oldPrice)}</span>` : ''}</div>
        ${!item.available ? `<div class="closed-notice" style="margin-top:14px"><i class="fa-solid fa-circle-exclamation"></i> ${t('common.unavailable')}</div>` : ''}
        <div id="optionsMount" style="margin-top:20px"></div>
        <div class="flex center gap-4 wrap" style="margin-top:20px">
          <div class="stepper" style="transform:scale(1.15)"><button id="qtyDec" aria-label="Decrease">−</button><span class="qty" id="qtyVal">1</span><button id="qtyInc" aria-label="Increase">+</button></div>
          <button class="btn btn-primary btn-lg" id="addBtn" ${item.available ? '' : 'disabled'}><i class="fa-solid fa-cart-plus"></i> ${t('common.addToCart')} · <span id="btnTotal">${money(sizePrice)}</span></button>
          <button class="btn btn-secondary btn-lg" id="orderNowBtn" ${item.available ? '' : 'disabled'}>${t('common.orderNow')}</button>
        </div>
      </div>
    </div>

    <div style="margin-top:48px">
      <div class="tabs" id="itemTabs" role="tablist">
        <button class="active" data-tab="desc" role="tab">${t('item.description')}</button>
        <button data-tab="nutri" role="tab">${t('item.nutrition')}</button>
        <button data-tab="reviews" id="reviewsTab" role="tab">${t('item.reviews')}</button>
      </div>
      <div style="padding-top:24px">
        <div class="tab-panel active" id="tab-desc">
          <h3>${t('item.ingredients')}</h3>
          <div class="flex wrap gap-2">${item.ingredients.map((i) => `<span class="chip">${esc(i)}</span>`).join('')}</div>
          <h3 class="mt-6">${t('item.allergens')}</h3>
          ${item.allergens.length ? `<div class="flex wrap gap-2">${item.allergens.map((a) => `<span class="chip" style="background:#fdecea;color:#b3261e"><i class="fa-solid fa-triangle-exclamation"></i> ${esc(a)}</span>`).join('')}</div>` : `<p class="muted">${t('common.vegetarian')}</p>`}
        </div>
        <div class="tab-panel" id="tab-nutri">
          <table style="width:100%;max-width:480px;border-collapse:collapse">
            ${[['Calories', item.calories + ' kcal'], ['Protein', Math.round(item.calories * 0.05) + ' g'], ['Carbs', Math.round(item.calories * 0.1) + ' g'], ['Fat', Math.round(item.calories * 0.045) + ' g'], ['Sodium', Math.round(item.calories * 0.9) + ' mg']].map(([k, v]) => `<tr style="border-bottom:1px solid var(--border)"><td style="padding:10px 0" class="muted">${k}</td><td style="padding:10px 0;text-align:end;font-weight:600">${v}</td></tr>`).join('')}
          </table>
        </div>
        <div class="tab-panel" id="tab-reviews"></div>
      </div>
    </div>

    <section class="section" style="padding-bottom:0">
      <div class="section-head" style="text-align:start;margin-inline:0"><h2>${t('item.goesWell')}</h2></div>
      <div class="grid menu-grid" id="goesWell"></div>
    </section>

    <section class="section" id="recentSection">
      <div class="section-head" style="text-align:start;margin-inline:0"><h2>${t('item.recentlyViewed')}</h2></div>
      <div class="grid menu-grid" id="recentlyViewed"></div>
    </section>
  </div>`;

  renderOptions();
  wireQtyAndAdd();
  wireGallery();
  wireTabs();
  renderReviews();
  renderGoesWell();
  renderRecent();
  injectSchema(item);

  function unit() { return sizePrice + extras.reduce((s, e) => s + e.price, 0); }
  function updatePrice() {
    $('#unitPrice').innerHTML = money(unit()) + (item.oldPrice ? `<span class="old-price">${money(item.oldPrice)}</span>` : '');
    $('#btnTotal').textContent = money(unit() * qty);
  }

  function renderOptions() {
    const mount = $('#optionsMount');
    let html = '';
    if (sizes) {
      html += `<div class="option-group"><h4>${t('item.size')}</h4><div class="option-list">` +
        sizes.map((s, i) => `<label class="option-item ${i === 0 ? 'selected' : ''}" data-size><input type="radio" name="size" value="${esc(s.name)}" data-price="${s.price}" ${i === 0 ? 'checked' : ''}><span>${esc(s.name)}</span><span class="o-price">${money(s.price)}</span></label>`).join('') +
        '</div></div>';
    }
    html += `<div class="option-group"><h4>${t('item.spice')} <span class="muted" style="font-weight:400;font-size:.85rem">🌶</span></h4><div class="spice-levels">` +
      SPICE.map((s, i) => `<button type="button" data-spice="${s}" class="${i === 0 ? 'active' : ''}">${s}</button>`).join('') + '</div></div>';
    if (item.extras && item.extras.length) {
      html += `<div class="option-group"><h4>${t('item.extras')}</h4><div class="option-list">` +
        item.extras.map((e) => `<label class="option-item"><input type="checkbox" data-extra="${esc(e.name)}" data-price="${e.price}"><span>${esc(e.name)}</span><span class="o-price">+${money(e.price)}</span></label>`).join('') +
        '</div></div>';
    }
    html += `<div class="field"><label for="itemNotes">${t('common.notes')}</label><textarea id="itemNotes" rows="2" placeholder="${t('common.notes')}…"></textarea></div>`;
    mount.innerHTML = html;

    mount.querySelectorAll('[data-size] input').forEach((r) => r.addEventListener('change', () => {
      sizeName = r.value; sizePrice = Number(r.dataset.price);
      mount.querySelectorAll('[data-size]').forEach((l) => l.classList.toggle('selected', l.contains(r)));
      updatePrice();
    }));
    mount.querySelectorAll('[data-extra]').forEach((c) => c.addEventListener('change', () => {
      extras = $$('[data-extra]:checked', mount).map((x) => ({ name: x.dataset.extra, price: Number(x.dataset.price) }));
      c.closest('.option-item').classList.toggle('selected', c.checked);
      updatePrice();
    }));
    mount.querySelectorAll('[data-spice]').forEach((b) => b.addEventListener('click', () => {
      spice = b.dataset.spice;
      mount.querySelectorAll('[data-spice]').forEach((x) => x.classList.toggle('active', x === b));
    }));
  }

  function config() {
    return { id: item.id, name: item.name, image: item.images[0], basePrice: sizePrice, size: sizeName, extras, notes: $('#itemNotes')?.value.trim() || '', spice };
  }

  function wireQtyAndAdd() {
    $('#qtyInc').addEventListener('click', () => { qty++; $('#qtyVal').textContent = qty; updatePrice(); });
    $('#qtyDec').addEventListener('click', () => { qty = Math.max(1, qty - 1); $('#qtyVal').textContent = qty; updatePrice(); });
    $('#addBtn').addEventListener('click', () => { addToCart(config(), qty); toast(`${esc(item.name)} — ${t('toast.added')}`, 'success'); });
    $('#orderNowBtn').addEventListener('click', () => { addToCart(config(), qty); location.href = 'checkout.html'; });
  }

  function wireGallery() {
    const mainImg = $('#galleryMain');
    $$('#thumbs img').forEach((th) => th.addEventListener('click', () => {
      mainImg.src = th.dataset.src;
      $$('#thumbs img').forEach((x) => x.classList.toggle('active', x === th));
    }));
    mainImg.addEventListener('click', () => {
      openModal({ title: '', wide: true, body: el('img', { src: mainImg.src, alt: item.name, style: 'width:100%;border-radius:16px' }) });
    });
  }

  function wireTabs() {
    $$('#itemTabs button').forEach((b) => b.addEventListener('click', () => {
      $$('#itemTabs button').forEach((x) => x.classList.toggle('active', x === b));
      $$('.tab-panel').forEach((p) => p.classList.toggle('active', p.id === 'tab-' + b.dataset.tab));
    }));
  }

  function renderReviews() {
    const local = getReviews(item.id);
    const all = [...local.map((r) => ({ ...r, name: r.name || 'Guest', rating: r.rating })), ...sampleReviews()].slice(0, 8);
    const avg = item.rating;
    const dist = [5, 4, 3, 2, 1].map((s) => ({ s, pct: s === 5 ? 70 : s === 4 ? 20 : s === 3 ? 6 : s === 2 ? 3 : 1 }));
    $('#tab-reviews').innerHTML = `
      <div class="split" style="grid-template-columns:260px 1fr;gap:32px;align-items:start">
        <div style="text-align:center">
          <div style="font-family:var(--font-head);font-size:4rem;line-height:1;color:var(--red-deep)">${avg.toFixed(1)}</div>
          ${starsHTML(avg)}
          <p class="muted">${item.reviewsCount + local.length} ${t('item.reviewsCount')}</p>
        </div>
        <div class="rating-bars">
          ${dist.map((d) => `<div class="rb-row"><span>${d.s}★</span><div class="progress"><div class="bar" style="width:${d.pct}%"></div></div><span>${d.pct}%</span></div>`).join('')}
          <button class="btn btn-outline btn-sm mt-4" id="writeReview"><i class="fa-solid fa-pen"></i> ${t('item.addReview')}</button>
        </div>
      </div>
      <div id="reviewList" style="margin-top:24px"></div>`;
    paintReviews(all);
    $('#writeReview').addEventListener('click', () => reviewForm());
  }

  function sampleReviews() {
    return [
      { name: 'Youssef A.', rating: 5, text: 'Absolutely delicious, perfectly seasoned.', date: Date.now() - 864e5 },
      { name: 'Nour S.', rating: 4, text: 'Great taste, wish the portion was bigger.', date: Date.now() - 2 * 864e5 }
    ];
  }

  function paintReviews(list) {
    const host = $('#reviewList');
    host.innerHTML = list.map((r) => `<div class="review-card" style="margin-bottom:12px"><div class="flex between center"><strong>${esc(r.name)}</strong><span class="stars">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</span></div><p class="quote">${esc(r.text)}</p><small class="muted">${new Date(r.date).toLocaleDateString()}</small></div>`).join('');
  }

  function reviewForm() {
    const body = el('form', { id: 'reviewForm' },
      el('div', { class: 'field' }, el('label', {}, t('item.yourName')), el('input', { id: 'rvName', required: true })),
      el('div', { class: 'field' }, el('label', {}, t('common.rating')), el('select', { id: 'rvRating' }, ...[5, 4, 3, 2, 1].map((n) => el('option', { value: n }, '★'.repeat(n)))),
      el('div', { class: 'field' }, el('label', {}, t('item.yourReview')), el('textarea', { id: 'rvText', rows: 3, required: true })),
      el('button', { class: 'btn btn-primary btn-block', type: 'submit' }, t('item.submitReview'))
    );
    openModal({ title: t('item.addReview'), body });
    body.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = $('#rvName').value.trim() || 'Guest';
      const rating = Number($('#rvRating').value);
      const text = $('#rvText').value.trim();
      if (!text) return;
      addReview(item.id, { name, rating, text, date: Date.now() });
      toast(t('toast.reviewAdded'), 'success');
      closeModal();
      renderReviews();
    });
  }

  function renderGoesWell() {
    const picks = MENU.filter((m) => m.id !== item.id && (m.category === 'sides' || m.category === 'drinks')).slice(0, 4);
    const host = $('#goesWell'); host.innerHTML = '';
    picks.forEach((p) => host.append(renderCard(p)));
  }

  function renderRecent() {
    const recent = getRecent().map(byId).filter((x) => x && x.id !== item.id).slice(0, 4);
    const host = $('#recentlyViewed');
    if (!recent.length) { $('#recentSection').classList.add('hide'); return; }
    recent.forEach((p) => host.append(renderCard(p)));
  }
}

function injectSchema(item) {
  const script = el('script', { type: 'application/ld+json', html: JSON.stringify({
    '@context': 'https://schema.org', '@type': 'MenuItem', name: item.name,
    description: item.description, image: item.images[0], nutrition: { '@type': 'NutritionInformation', calories: item.calories + ' kcal' },
    offers: { '@type': 'Offer', price: item.price, priceCurrency: 'EGP' },
    aggregateRating: { '@type': 'AggregateRating', ratingValue: item.rating, reviewCount: item.reviewsCount }
  }) });
  document.head.append(script);
}
