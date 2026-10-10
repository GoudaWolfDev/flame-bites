/** About page: story timeline, team, values, counters. */
import { $, $$, img, lazyImg, countUp } from '../core/utils.js';
import { t } from '../core/i18n.js';

const TIMELINE = [
  ['2016', 'A single grill', 'Two friends opened a tiny burger stand with one grill and a big dream in Maadi.'],
  ['2018', 'The secret recipe', 'We perfected our 11-spice fried chicken blend, and the queues began.'],
  ['2021', 'Going city-wide', 'Flame Bites expanded to four branches and launched online ordering.'],
  ['2024', 'Flame everywhere', 'Over 120,000 orders served and counting — still grilled fresh every time.']
];
const TEAM = [
  ['Karim Adel', 'Founder & Head Chef', '1500648767791-00dcc994a43e'],
  ['Mona Farouk', 'Operations Director', '1494790108377-be9c29b29330'],
  ['Hassan Riad', 'Grill Master', '1507003211169-0a1dd7228f2d']
];

export async function init() {
  $('#main').innerHTML = `<div class="page-hero"><div class="container"><h1>${t('about.title')}</h1><p>${t('home.whyTitle')}</p></div></div>
  <div class="container section">
    <div class="split">
      <div class="reveal">
        <span class="eyebrow" style="color:var(--red-primary);font-family:var(--font-head);letter-spacing:2px">SINCE 2016</span>
        <h2>Bold flavours, grilled over real flames</h2>
        <p class="muted">What started as a single burger stand is now the city's go-to spot for flame-grilled fast food. We grind our beef fresh daily, marinate chicken for 24 hours and never cut corners on flavour.</p>
        <p class="muted">From our smoky burgers to our shatteringly crispy chicken, everything is made to order and delivered hot.</p>
      </div>
      <img class="reveal" src="${img('1550547660-d9450f859349', 800)}" alt="Flame grilled burger" style="border-radius:var(--radius-lg);box-shadow:var(--shadow-lg)">
    </div>

    <div class="split" style="margin-top:56px">
      <div class="reveal">
        <h2>Our Journey</h2>
        <div class="timeline">
          ${TIMELINE.map(([y, h, d]) => `<div class="tl"><h4>${y} · ${h}</h4><p class="muted">${d}</p></div>`).join('')}
        </div>
      </div>
      <div class="reveal" style="background:var(--grad-red);border-radius:var(--radius-lg);padding:40px;color:#fff;text-align:center">
        <div class="stats-grid" style="grid-template-columns:1fr 1fr">
          <div class="stat"><div class="num" data-count="120000">0</div><div class="lbl">${t('home.statOrders')}</div></div>
          <div class="stat"><div class="num" data-count="42">0</div><div class="lbl">${t('home.statDishes')}</div></div>
          <div class="stat"><div class="num" data-count="4">0</div><div class="lbl">${t('home.statBranches')}</div></div>
          <div class="stat"><div class="num" data-count="4.8">0</div><div class="lbl">${t('home.statRating')}</div></div>
        </div>
      </div>
    </div>

    <div class="section-head" style="margin-top:64px"><h2>${t('about.valuesTitle')}</h2><p>${t('home.whyTitle')}</p></div>
    <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(200px,1fr))">
      ${[['leaf', 'home.why1'], ['heart', 'home.why2'], ['shield-halved', 'home.why3'], ['seedling', 'home.why4']].map(([ic, k]) => `<div class="text-center reveal" style="padding:24px"><div class="cat-pill" style="display:inline-flex"><span class="ring" style="background:var(--grad-yellow)"><i class="fa-solid fa-${ic}"></i></span></div><h3 class="mt-2">${t(k)}</h3></div>`).join('')}
    </div>

    <div class="section-head" style="margin-top:64px"><h2>${t('about.teamTitle')}</h2></div>
    <div class="team-grid">
      ${TEAM.map(([n, r, a]) => `<div class="team-card reveal">${lazyImg(img(a, 300), n).outerHTML}<h3>${n}</h3><p class="muted">${r}</p></div>`).join('')}
    </div>
  </div>`;

  const obs = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { countUp(e.target, parseFloat(e.target.dataset.count)); obs.unobserve(e.target); } }), { threshold: 0.4 });
  $$('.stat .num').forEach((n) => obs.observe(n));
}
