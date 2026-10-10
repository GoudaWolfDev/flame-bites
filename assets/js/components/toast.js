/** Accessible toast notifications. */
import { el } from '../core/utils.js';

let wrap;

function ensure() {
  if (!wrap) {
    wrap = el('div', { class: 'toast-wrap', role: 'status', 'aria-live': 'polite' });
    document.body.append(wrap);
  }
}

/**
 * Show a toast.
 * @param {string} msg
 * @param {'success'|'error'|'info'} type
 * @param {number} duration
 */
export function toast(msg, type = 'success', duration = 3000) {
  ensure();
  const icons = { success: 'fa-circle-check', error: 'fa-circle-exclamation', info: 'fa-circle-info' };
  const node = el('div', { class: `toast ${type}`, role: 'alert' },
    el('div', { class: 't-icon' }, el('i', { class: `fa-solid ${icons[type] || icons.info}` })),
    el('div', { class: 't-body', html: msg }),
    el('button', { class: 't-close', 'aria-label': 'Close', onclick: () => dismiss(node) },
      el('i', { class: 'fa-solid fa-xmark' }))
  );
  wrap.append(node);
  const timer = setTimeout(() => dismiss(node), duration);
  node.addEventListener('mouseenter', () => clearTimeout(timer));
  return node;
}

function dismiss(node) {
  if (!node || node.dataset.out) return;
  node.dataset.out = '1';
  node.classList.add('out');
  setTimeout(() => node.remove(), 300);
}

export const toastSuccess = (m) => toast(m, 'success');
export const toastError = (m) => toast(m, 'error');
export const toastInfo = (m) => toast(m, 'info');
