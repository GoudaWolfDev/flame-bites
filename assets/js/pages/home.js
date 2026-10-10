/** Home page: builds all landing sections and wires sliders/counters. */
import { $, $$, el, img, lazyImg, countUp, initReveal, esc } from '../core/utils.js';
import { t } from '../core/i18n.js';
import { CONFIG } from '../core/config.js';
import { CATEGORIES } from '../data/categories.js';
import { MENU, bestSellers } from '../data/menu.js';
import { BRANCHES } from '../data/branches.js';
import { renderCard } from '../components/card.js';
import { createSlider } from '../components/slider.js';
import { createCountdown, countdownHTML, endOfDay } from '../components/countdown.js';

const HERO = [
  { id: '1568901346375-23c9450c58cd', title: 'Flame-Grilled to Perfection', text: 'Juicy char-grilled burgers stacked high and delivered hot.', cta: 'menu.html' },
  { id: '1626645738196-c2a7c87a8f58', title: 'Crispy Fried Chicken', text: 'Our secret-recipe chicken, golden and crunchy every time.', cta: 'menu.html?cat=chicken' },
  { id: '1598515214211-89d3c73ae83b', title: 'Meals Worth Sharing', text: 'Combos built for two, four or the whole hungry family.', cta: 'menu.html?cat=combos' }
];

const REVIEWS = [
  { name: 'Sara M.', text: 'Best burger in Cairo, hands down. The flame sauce is unreal!', rating: 5, avatar: '1494790108377-be9c29b29330' },
  { name: 'Ahmed K.', text: 'Fast delivery and the chicken was still piping hot. 10/10.', rating: 5, avatar: '1500648767791-00dcc994a43e' },
  { name: 'Laila H.', text: 'The loaded cheese fries are dangerously good. Ordering again!', rating: 4, avatar: '1438761681033-6461ffad8d80' },
  { name: 'Omar T.', text: 'Generous portions, great prices and always fresh. My go-to spot.', rating: 5, avatar: '1507003211169-0a1dd7228f2d' }
];

function sectionHead(eyebrow, title, sub) {
  return `<div class="section-head reveal"><span class="eyebrow">${eyebrow}</span><h2>${title}</h2>${sub ? `<p>${sub}</p>` : ''}</div>`;
}

const heroHTML = () => `
<div class="hero" id="hero">
  <div class="hero-slides">
    ${HERO.map((h, i) => `<div class="hero-slide ${i === 0 ? 'active' : ''}" style="background-image:url(${img(h.id, 1600)})"></div>`).join('')}
  </div>
  <div class="container">
    <div class="hero-content">
      <span class="hero-badge">🔥 ${t('home.heroBadge')}</span>
      <div id="heroText">${heroText(0)}</div>
      <div class="hero-actions" id="heroActions">
        <a class="btn btn-secondary btn-lg" href="${HERO[0].cta}">${t('common.orderNow')} <i class="fa-solid fa-arrow-right"></i></a>
        <a class="btn btn-outline btn-lg" style="color:#fff;border-color:#fff" href="menu.html">${t('common.viewMenu')}</a>
      </div>
    </div>
  </div>
  <div class="hero-nav">
    <button aria-label="Previous" id="heroPrev"><i class="fa-solid fa-chevron-up"></i></button>
    <button aria-label="Next" id="heroNext"><i class="fa-solid fa-chevron-down"></i></button>
  </div>
  <div class="slider-dots hero-slider-dots" id="heroDots"></div>
</div>`;

function heroText(i) {
  return `<h1>${esc(HERO[i].title)}</h1><p>${esc(HERO[i].text)}</p>`;
}

export async function init() {
  const main2 = $('#main');
  const deals = MENU.filter((m) => m.oldPrice).slice(0, 3);
  const cats = CATEGORIES;
  const best = bestSellers();

  main2.innerHTML = `
  ${heroHTML()}
  <section class="section" style="padding-top:0;margin-top:-40px;position:relative;z-index:10">
    <div class="container">
      <div class="quick-cats reveal" id="quickCats">
        ${cats.map((c) => `<a class="cat-pill" href="menu.html?cat=${c.id}"><span class="ring">${c.emoji}</span><span>${c.name}</span></a>`).join('')}
      </div>
    </div>
  </section>

  <section class="section" style="background:var(--bg-soft)">
    <div class="container">
      <div class="flex between center wrap gap-4">
        ${sectionHead('⚡ ' + t('home.deals'), t('home.deals'), t('home.dealsSub'))}
        <div class="countdown light reveal" id="dealsCountdown" aria-label="Deal ends in">${countdownHTML()}</div>
      </div>
      <div class="grid menu-grid" id="dealsGrid" style="margin-top:24px"></div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      ${sectionHead('🔥 ' + t('common.bestseller'), t('home.bestsellers'), t('home.bestsellersSub'))}
      <div class="carousel reveal">
        <div class="slider" id="bestSlider"><div class="slider-track" id="bestTrack"></div></div>
      </div>
    </div>
  </section>

  <section class="section" style="padding-top:0">
    <div class="container">
      <div class="combo-banner reveal">
        <div>
          <h2>${t('home.comboTitle')}</h2>
          <p style="color:#ffe6c2">${t('home.comboSub')}</p>
          <div class="combo-steps">
            <span class="chip">1. ${t('home.how1')}</span><span class="chip">2. + Side</span><span class="chip">3. + Drink</span>
          </div>
          <a class="btn btn-secondary btn-lg" href="menu.html?cat=combos">${t('home.comboBtn')} <i class="fa-solid fa-arrow-right"></i></a>
        </div>
        <img src="${img('1598515214211-89d3c73ae83b', 700)}" alt="Meal combo" style="border-radius:var(--radius);box-shadow:var(--shadow-lg)" loading="lazy">
      </div>
    </div>
  </section>

  <section class="section" style="padding-top:0">
    <div class="container">
      <div class="grid promo-banners-grid" id="promoBanners">
        <a class="offer-card red reveal" href="offers.html"><span class="badge badge-new">Limited</span><div class="discount">20%</div><h3 style="color:#fff;margin:0">First order</h3><p style="color:#ffe6c2;margin:0">Use code WELCOME20</p></a>
        <a class="offer-card yellow reveal" href="menu.html?cat=chicken"><div class="discount">2 for 1</div><h3 style="margin:0">Chicken Tuesdays</h3><p style="margin:0">Every Tuesday, all day</p></a>
        <a class="offer-card orange reveal" href="menu.html?cat=combos"><div class="discount">-30%</div><h3 style="color:#fff;margin:0">Family Buckets</h3><p style="color:#ffe6c2;margin:0">Save on every combo</p></a>
      </div>
    </div>
  </section>

  <section class="section" style="background:var(--bg-soft)">
    <div class="container">
      ${sectionHead('🍔 ' + t('page.home'), t('home.howTitle'), '')}
      <div class="grid how-grid">
        ${[['fa-hand-pointer', 'home.how1', 'home.how1d'], ['fa-credit-card', 'home.how2', 'home.how2d'], ['fa-motorcycle', 'home.how3', 'home.how3d']]
          .map(([ic, k, d]) => `<div class="text-center reveal" style="padding:24px"><div class="cat-pill" style="display:inline-flex"><span class="ring" style="background:var(--grad-red);color:#fff">${'<i class="fa-solid ' + ic + '"></i>'}</span></div><h3 class="mt-2">${t(k)}</h3><p class="muted">${t(d)}</p></div>`).join('')}
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="split">
        <div class="reveal">
          ${sectionHead('💯 ' + t('page.about'), t('home.whyTitle'), '')}
          <ul class="check-list">
            ${[['leaf', 'home.why1', 'home.why1d'], ['bolt', 'home.why2', 'home.why2d'], ['certificate', 'home.why3', 'home.why3d'], ['moon', 'home.why4', 'home.why4d']]
              .map(([ic, k, d]) => `<li><span class="ic"><i class="fa-solid fa-${ic}"></i></span><div><strong>${t(k)}</strong><span class="muted">${t(d)}</span></div></li>`).join('')}
          </ul>
        </div>
        <div class="reveal" style="background:var(--grad-red);border-radius:var(--radius-lg);padding:32px;color:#fff">
          <div class="stats-grid" style="grid-template-columns:repeat(2,1fr);gap:24px">
            <div class="stat"><div class="num" data-count="120000">0</div><div class="lbl">${t('home.statOrders')}</div></div>
            <div class="stat"><div class="num" data-count="42">0</div><div class="lbl">${t('home.statDishes')}</div></div>
            <div class="stat"><div class="num" data-count="4">0</div><div class="lbl">${t('home.statBranches')}</div></div>
            <div class="stat"><div class="num" data-count="4.8">0</div><div class="lbl">${t('home.statRating')}</div></div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="section" style="background:var(--bg-soft)">
    <div class="container">
      ${sectionHead('⭐ ' + t('common.rating'), t('home.reviewsTitle'), '')}
      <div class="carousel reveal">
        <div class="slider" id="reviewSlider"><div class="slider-track" id="reviewTrack"></div></div>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      ${sectionHead('📸 Instagram', t('home.instaTitle'), t('home.instaSub'))}
      <div class="insta-grid reveal" id="instaGrid">
        ${MENU.slice(0, 12).map((m) => `<a href="item.html?id=${m.id}" aria-label="${esc(m.name)}">${lazyImg(img(m.images[0].split('photo-')[1].split('?')[0], 400), m.name).outerHTML}<span class="ov"><i class="fa-brands fa-instagram"></i></span></a>`).join('')}
      </div>
    </div>
  </section>

  <section class="section" style="padding-top:0">
    <div class="container">
      ${sectionHead('📍 ' + t('nav.branches'), t('home.branchesTitle'), '')}
      <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(240px,1fr))">
        ${BRANCHES.slice(0, 3).map((b) => `<div class="branch-card reveal"><iframe src="${b.map}" title="${esc(b.name)} map" loading="lazy"></iframe><div class="bc-body"><h3>${b.name}</h3><div class="bc-row"><i class="fa-solid fa-location-dot"></i>${b.address}</div><a class="btn btn-outline btn-sm" href="branches.html">${t('branches.directions')}</a></div></div>`).join('')}
      </div>
    </div>
  </section>

  <section class="section" style="padding-top:0">
    <div class="container">
      <div class="combo-banner reveal" style="background:var(--grad-yellow);color:var(--black)">
        <div>
          <h2 style="color:var(--black)">${t('home.appTitle')}</h2>
          <p>${t('home.appSub')}</p>
          <div class="store-badges">
            <a href="${CONFIG.appLinks.apple}" style="background:rgba(0,0,0,.85);color:#fff"><i class="fa-brands fa-apple"></i> App Store</a>
            <a href="${CONFIG.appLinks.google}" style="background:rgba(0,0,0,.85);color:#fff"><i class="fa-brands fa-google-play"></i> Google Play</a>
          </div>
        </div>
        <i class="fa-solid fa-mobile-screen-button" style="font-size:8rem;opacity:.25;color:#000"></i>
      </div>
    </div>
  </section>`;

  // quick categories (localised labels)
  const catLabels = { burgers: 'Burgers', chicken: 'Chicken', wraps: 'Wraps', sides: 'Sides', drinks: 'Drinks', desserts: 'Desserts', combos: 'Combos' };
  $$('#quickCats .cat-pill').forEach((pill, i) => { pill.querySelectorAll('span')[1].textContent = catLabels[cats[i].id]; });

  // deals
  const dealGrid = $('#dealsGrid');
  deals.forEach((d) => dealGrid.append(renderCard(d, { reveal: true })));
  createCountdown($('#dealsCountdown'), endOfDay());

  // best sellers
  const track = $('#bestTrack');
  const perView = window.innerWidth <= 768 ? 1 : window.innerWidth <= 1024 ? 2 : 4;
  best.slice(0, 8).forEach((b) => {
    const slide = el('div', { class: 'slider-slide', style: `padding:0 8px` });
    slide.append(renderCard(b));
    track.append(slide);
  });
  $$('#bestTrack .slider-slide').forEach((s) => { s.style.minWidth = `${100 / perView}%`; });
  createSlider($('#bestSlider'), { autoplay: true, interval: 4500, dots: false, perView });

  // reviews
  const rTrack = $('#reviewTrack');
  REVIEWS.forEach((r) => {
    const slide = el('div', { class: 'slider-slide', style: 'padding:0 8px' });
    slide.append(el('div', { class: 'review-card' },
      el('div', { class: 'stars', html: '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating) }),
      el('p', { class: 'quote' }, `“${r.text}”`),
      el('div', { class: 'reviewer' }, lazyImg(img(r.avatar, 120), r.name), el('div', {}, el('strong', {}, r.name), el('small', { class: 'muted' }, 'Verified customer')))));
    rTrack.append(slide);
  });
  $$('#reviewTrack .slider-slide').forEach((s) => { s.style.minWidth = `${100 / (window.innerWidth <= 768 ? 1 : 3)}%`; });
  createSlider($('#reviewSlider'), { autoplay: true, interval: 5000, dots: true });

  // hero slider controls
  initHero($('#hero'));

  // stats counters
  const statObs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { const v = parseFloat(e.target.dataset.count); countUp(e.target, v); statObs.unobserve(e.target); }
    });
  }, { threshold: 0.4 });
  $$('.stat .num').forEach((n) => statObs.observe(n));

  initReveal();
}

function initHero(hero) {
  if (!hero) return;
  const slides = $$('.hero-slide', hero);
  const dots = $('#heroDots', hero);
  const textWrap = $('#heroText', hero);
  const actions = $('#heroActions', hero);
  let i = 0, timer;
  slides.forEach((s, idx) => dots.append(el('button', { 'aria-label': `Slide ${idx + 1}`, class: idx === 0 ? 'active' : '', onclick: () => go(idx) })));

  function go(n) {
    i = (n + slides.length) % slides.length;
    slides.forEach((s, idx) => s.classList.toggle('active', idx === i));
    $$('button', dots).forEach((d, idx) => d.classList.toggle('active', idx === i));
    textWrap.innerHTML = heroText(i);
    actions.firstElementChild.setAttribute('href', HERO[i].cta);
    restart();
  }
  function restart() { clearInterval(timer); timer = setInterval(() => go(i + 1), 6000); }
  $('#heroNext', hero)?.addEventListener('click', () => go(i + 1));
  $('#heroPrev', hero)?.addEventListener('click', () => go(i - 1));
  hero.addEventListener('mouseenter', () => clearInterval(timer));
  hero.addEventListener('mouseleave', restart);
  restart();
}
