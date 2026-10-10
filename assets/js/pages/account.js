/** Account page: profile, orders, addresses, favorites, loyalty. */
import { $, $$, el, esc } from '../core/utils.js';
import { t } from '../core/i18n.js';
import { money } from '../core/currency.js';
import { byId } from '../data/menu.js';
import { getUser, setUser, logout, getOrders, getAddresses, addAddress, removeAddress, getFavorites, addToCart, on } from '../core/store.js';
import { renderCard } from '../components/card.js';
import { toast } from '../components/toast.js';

const TABS = [['profile', 'fa-user', 'account.profile'], ['orders', 'fa-receipt', 'account.orders'], ['addresses', 'fa-location-dot', 'account.addresses'], ['favorites', 'fa-heart', 'account.favorites']];

export async function init() {
  const user = getUser();
  if (!user) {
    $('#main').innerHTML = `<div class="container section"><div class="empty-state"><div class="icon"><i class="fa-solid fa-user-lock"></i></div><h2>${t('auth.login')}</h2><p>${t('toast.loginNeeded')}</p><a class="btn btn-primary mt-4" href="login.html">${t('auth.login')}</a></div></div>`;
    return;
  }
  const orders = getOrders();
  const points = orders.length * 50;

  $('#main').innerHTML = `<div class="page-hero"><div class="container"><h1>${t('account.welcome')}, ${esc(user.name.split(' ')[0])}</h1></div></div>
  <div class="container section">
    <div class="loyalty-badge reveal" style="margin-bottom:32px">
      <div><span class="badge" style="background:rgba(0,0,0,.85);color:var(--yellow-primary)">${t('account.loyalty')}</span><div class="pts">${points}</div></div>
      <i class="fa-solid fa-medal" style="font-size:3.4rem;opacity:.5"></i>
    </div>
    <div class="account-grid">
      <nav class="account-nav">
        ${TABS.map(([id, ic, k], i) => `<button data-tab="${id}" class="${i === 0 ? 'active' : ''}"><i class="fa-solid ${ic}"></i> ${t(k)}</button>`).join('')}
        <button id="logoutBtn" style="color:var(--red-bright)"><i class="fa-solid fa-right-from-bracket"></i> ${t('auth.logout')}</button>
      </nav>
      <div>
        <div class="account-panel active" data-panel="profile">
          <h2>${t('account.profile')}</h2>
          <form id="profileForm" class="card" style="padding:24px;max-width:520px">
            <div class="field"><label>${t('auth.fullName')}</label><input id="pName" value="${esc(user.name)}"></div>
            <div class="field"><label>${t('auth.email')}</label><input id="pEmail" type="email" value="${esc(user.email)}"></div>
            <div class="field"><label>${t('checkout.phone')}</label><input id="pPhone" value="${esc(user.phone || '')}"></div>
            <button class="btn btn-primary" type="submit">${t('account.save')}</button>
          </form>
        </div>
        <div class="account-panel" data-panel="orders">
          <h2>${t('account.orders')}</h2>
          <div id="ordersList"></div>
        </div>
        <div class="account-panel" data-panel="addresses">
          <h2>${t('account.addresses')}</h2>
          <div id="addrList" style="margin-bottom:24px"></div>
          <form id="addrForm" class="card" style="padding:24px;max-width:520px">
            <div class="field"><label>Label</label><input id="aLabel" placeholder="Home / Work"></div>
            <div class="field"><label>${t('checkout.address')}</label><input id="aAddress" required></div>
            <button class="btn btn-primary" type="submit"><i class="fa-solid fa-plus"></i> Add address</button>
          </form>
        </div>
        <div class="account-panel" data-panel="favorites">
          <h2>${t('account.favorites')}</h2>
          <div class="grid menu-grid" id="favGrid"></div>
        </div>
      </div>
    </div>
  </div>`;

  // tabs
  $$('.account-nav [data-tab]').forEach((b) => b.addEventListener('click', () => {
    $$('.account-nav [data-tab]').forEach((x) => x.classList.toggle('active', x === b));
    $$('.account-panel').forEach((p) => p.classList.toggle('active', p.dataset.panel === b.dataset.tab));
  }));

  $('#logoutBtn').addEventListener('click', () => { logout(); toast(t('toast.loggedOut'), 'info'); location.href = 'index.html'; });

  $('#profileForm').addEventListener('submit', (e) => {
    e.preventDefault();
    setUser({ ...user, name: $('#pName').value.trim(), email: $('#pEmail').value.trim(), phone: $('#pPhone').value.trim() });
    toast('Profile updated', 'success');
  });

  // orders
  function renderOrders() {
    const list = getOrders();
    const host = $('#ordersList');
    if (!list.length) { host.innerHTML = `<div class="empty-state"><div class="icon"><i class="fa-solid fa-receipt"></i></div><h3>${t('account.noOrders')}</h3><p>${t('account.noOrdersDesc')}</p><a class="btn btn-primary mt-4" href="menu.html">${t('common.viewMenu')}</a></div>`; return; }
    host.innerHTML = '';
    list.forEach((o) => {
      host.append(el('div', { class: 'order-card' },
        el('div', {}, el('strong', {}, '#' + o.orderNo), el('div', { class: 'muted', style: 'font-size:.82rem' }, new Date(o.date).toLocaleString()),
          el('div', { class: 'muted', style: 'font-size:.82rem' }, `${o.items.length} items · ${money(o.totals.total)}`)),
        el('div', { class: 'flex center gap-3' },
          el('span', { class: `status-pill status-${o.status}` }, o.status.replace(/-/g, ' ')),
          el('button', { class: 'btn btn-sm btn-primary', onclick: () => reorder(o) }, el('i', { class: 'fa-solid fa-rotate-right' }), t('account.reorder')))));
    });
  }
  function reorder(o) {
    o.items.forEach((l) => addToCart({ id: l.id, name: l.name, image: l.image, basePrice: l.basePrice, size: l.size, extras: l.extras, notes: l.notes, spice: l.spice }, l.qty));
    toast(t('toast.added'), 'success');
    location.href = 'cart.html';
  }
  renderOrders();

  // addresses
  function renderAddr() {
    const list = getAddresses();
    const host = $('#addrList');
    host.innerHTML = list.length ? '' : '<p class="muted">No saved addresses yet.</p>';
    list.forEach((a) => host.append(el('div', { class: 'order-card' },
      el('div', {}, el('strong', {}, a.label || 'Address'), el('div', { class: 'muted' }, a.address)),
      el('button', { class: 'ci-remove', onclick: () => { removeAddress(a.id); renderAddr(); } }, el('i', { class: 'fa-solid fa-trash' })))));
  }
  renderAddr();
  $('#addrForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const addr = $('#aAddress').value.trim();
    if (!addr) return;
    addAddress({ label: $('#aLabel').value.trim(), address: addr });
    $('#aLabel').value = ''; $('#aAddress').value = '';
    toast('Address saved', 'success');
    renderAddr();
  });

  // favorites
  function renderFav() {
    const host = $('#favGrid');
    const favs = getFavorites().map(byId).filter(Boolean);
    host.innerHTML = '';
    if (!favs.length) { host.innerHTML = `<div class="empty-state"><div class="icon"><i class="fa-regular fa-heart"></i></div><h3>${t('account.noFav')}</h3><a class="btn btn-primary mt-4" href="menu.html">${t('common.viewMenu')}</a></div>`; return; }
    favs.forEach((f) => host.append(renderCard(f)));
  }
  renderFav();
  on('fav:change', renderFav);
}
