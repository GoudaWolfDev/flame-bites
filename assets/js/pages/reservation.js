/** Reservation page: date, slots, guests, validation, confirmation, localStorage. */
import { $, $$, el, esc } from '../core/utils.js';
import { t } from '../core/i18n.js';
import { addReservation, getReservations } from '../core/store.js';
import { toast } from '../components/toast.js';
import { openModal } from '../components/modal.js';

const SLOTS = ['12:00', '13:00', '14:00', '18:00', '19:00', '20:00', '21:00', '22:00'];

export async function init() {
  const today = new Date().toISOString().slice(0, 10);
  $('#main').innerHTML = `<div class="page-hero"><div class="container"><h1>${t('reservation.title')}</h1><p>${t('reservation.sub')}</p></div></div>
  <div class="container section">
    <div class="reservation-wrap">
      <form id="resForm" class="card" style="padding:28px" novalidate>
        <div class="field"><label for="rName">${t('checkout.fullName')} *</label><input id="rName" required><div class="error-msg">Required</div></div>
        <div class="flex gap-4 wrap">
          <div class="field" style="flex:1"><label for="rPhone">${t('checkout.phone')} *</label><input id="rPhone" inputmode="tel" required><div class="error-msg">Required</div></div>
          <div class="field" style="flex:1"><label for="rEmail">${t('checkout.email')}</label><input id="rEmail" type="email"><div class="error-msg">Invalid email</div></div>
        </div>
        <div class="flex gap-4 wrap">
          <div class="field" style="flex:1"><label for="rDate">${t('reservation.date')} *</label><input id="rDate" type="date" min="${today}" value="${today}"></div>
          <div class="field" style="flex:1"><label for="rGuests">${t('reservation.guests')} *</label><select id="rGuests">${[1, 2, 3, 4, 5, 6, 7, 8].map((n) => `<option ${n === 2 ? 'selected' : ''}>${n}</option>`).join('')}</select></div>
        </div>
        <div class="field"><label>${t('reservation.time')} *</label><div class="slot-grid" id="slots">${SLOTS.map((s, i) => `<button type="button" data-slot="${s}" class="${i === 3 ? 'active' : ''}">${s}</button>`).join('')}</div><div class="error-msg">Pick a time</div></div>
        <div class="field"><label for="rOccasion">${t('reservation.occasion')}</label><select id="rOccasion"><option value="">${t('reservation.none')}</option><option>${t('reservation.birthday')}</option><option>${t('reservation.anniversary')}</option><option>${t('reservation.business')}</option></select></div>
        <div class="field"><label for="rNotes">${t('common.notes')}</label><textarea id="rNotes" rows="2"></textarea></div>
        <button class="btn btn-primary btn-lg btn-block" type="submit"><i class="fa-solid fa-calendar-check"></i> ${t('reservation.book')}</button>
      </form>
      <aside class="card" style="padding:28px">
        <h3>${t('nav.branches')}</h3>
        <p class="muted">${t('reservation.sub')}</p>
        <div class="empty-state" style="padding:24px 0"><div class="icon"><i class="fa-solid fa-utensils"></i></div><p class="muted">Reservations are held for 15 minutes after your booking time.</p></div>
        <div id="myRes"></div>
      </aside>
    </div>
  </div>`;

  let slot = SLOTS[3];
  $('#slots').addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    slot = b.dataset.slot;
    $$('#slots button').forEach((x) => x.classList.toggle('active', x === b));
  });

  const form = $('#resForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let ok = true;
    const mark = (id, bad) => { $(id).closest('.field').classList.toggle('invalid', bad); ok = ok && !bad; };
    mark('#rName', $('#rName').value.trim().length < 2);
    mark('#rPhone', !/^[0-9+\s-]{8,}$/.test($('#rPhone').value.trim()));
    if ($('#rEmail').value) mark('#rEmail', !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test($('#rEmail').value));
    if (!slot) { ok = false; $('#slots').closest('.field').classList.add('invalid'); }
    if (!ok) { toast('Please fix the highlighted fields', 'error'); return; }

    const res = {
      name: $('#rName').value.trim(), phone: $('#rPhone').value.trim(), email: $('#rEmail').value.trim(),
      date: $('#rDate').value, time: slot, guests: $('#rGuests').value, occasion: $('#rOccasion').value, notes: $('#rNotes').value.trim()
    };
    addReservation(res);
    toast(t('toast.reserved'), 'success');
    openModal({
      title: t('reservation.confirmed'),
      body: el('div', {},
        el('p', {}, `<strong>${esc(res.name)}</strong>, your table for ${res.guests} is booked.`),
        el('ul', { class: 'mt-2' },
          el('li', {}, `📅 ${esc(res.date)}`),
          el('li', {}, `⏰ ${esc(res.time)}`),
          el('li', {}, `👥 ${esc(res.guests)} guests`),
          res.occasion ? el('li', {}, `🎉 ${esc(res.occasion)}`) : null
        ),
        el('a', { class: 'btn btn-primary btn-block mt-4', href: 'menu.html' }, t('common.viewMenu'))
      )
    });
    form.reset();
    renderMine();
  });

  renderMine();

  function renderMine() {
    const host = $('#myRes');
    const list = getReservations().slice(0, 3);
    if (!list.length) { host.innerHTML = ''; return; }
    host.innerHTML = `<h4 style="margin-top:16px">Your reservations</h4>` + list.map((r) => `<div class="order-card"><div><strong>${esc(r.date)} · ${esc(r.time)}</strong><div class="muted">${esc(r.guests)} guests${r.occasion ? ' · ' + esc(r.occasion) : ''}</div></div><span class="status-pill status-received">booked</span></div>`).join('');
  }
}
