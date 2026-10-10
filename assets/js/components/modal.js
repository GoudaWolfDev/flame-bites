/** Generic accessible modal with focus trapping and ESC/backdrop close. */
import { el, $, scrollLock } from '../core/utils.js';

let backdrop, lastFocus;

function ensure() {
  if (backdrop) return;
  backdrop = el('div', { class: 'modal-backdrop', role: 'dialog', 'aria-modal': 'true', onclick: (e) => { if (e.target === backdrop) closeModal(); } },
    el('div', { class: 'modal', id: 'fb-modal' })
  );
  document.body.append(backdrop);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && backdrop.classList.contains('open')) closeModal();
    if (e.key === 'Tab' && backdrop.classList.contains('open')) trap(e);
  });
}

function trap(e) {
  const focusables = backdrop.querySelectorAll('a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])');
  if (!focusables.length) return;
  const first = focusables[0], last = focusables[focusables.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

/**
 * @param {{title?:string, body:Node|string, wide?:boolean, footer?:Node}} opts
 * @returns {HTMLElement} the modal element
 */
export function openModal({ title = '', body, wide = false, footer = null }) {
  ensure();
  lastFocus = document.activeElement;
  const modal = backdrop.querySelector('.modal');
  modal.className = 'modal' + (wide ? ' wide' : '');
  modal.innerHTML = '';
  if (title) modal.append(el('div', { class: 'modal-head' },
    el('h3', {}, title),
    el('button', { class: 'icon-btn', 'aria-label': 'Close dialog', onclick: closeModal }, el('i', { class: 'fa-solid fa-xmark' }))
  ));
  const bodyEl = el('div', { class: 'modal-body' });
  if (typeof body === 'string') bodyEl.innerHTML = body;
  else if (body) bodyEl.append(body);
  modal.append(bodyEl);
  if (footer) modal.append(footer);
  backdrop.classList.add('open');
  scrollLock(true);
  setTimeout(() => { const f = modal.querySelector('button,input,a'); if (f) f.focus(); }, 50);
  return modal;
}

export function closeModal() {
  if (!backdrop) return;
  backdrop.classList.remove('open');
  scrollLock(false);
  if (lastFocus && lastFocus.focus) lastFocus.focus();
}

/** Simple confirm modal returning a promise. */
export function confirmModal(message, { title = 'Are you sure?', okText = 'Confirm', cancelText = 'Cancel' } = {}) {
  return new Promise((resolve) => {
    const body = el('div', {}, el('p', {}, message),
      el('div', { class: 'flex gap-3', style: 'margin-top:16px' },
        el('button', { class: 'btn btn-outline btn-block', onclick: () => { closeModal(); resolve(false); } }, cancelText),
        el('button', { class: 'btn btn-primary btn-block', onclick: () => { closeModal(); resolve(true); } }, okText)
      ));
    openModal({ title, body });
  });
}
