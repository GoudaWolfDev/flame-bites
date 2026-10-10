/** Shared DOM + math/format helpers. No globals — everything exported. */
import { CONFIG } from './config.js';

export const $ = (sel, ctx = document) => ctx.querySelector(sel);
export const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

/** Create an element with attrs and children (string | Node | array). */
export function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null || v === false) continue;
    if (k === 'class') node.className = v;
    else if (k === 'html') node.innerHTML = v;
    else if (k === 'dataset') Object.assign(node.dataset, v);
    else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2).toLowerCase(), v);
    else node.setAttribute(k, v);
  }
  for (const child of children.flat()) {
    if (child == null || child === false) continue;
    if (child.nodeType) {
      node.append(child);
    } else if (typeof child === 'string' && (child.includes('<') && child.includes('>'))) {
      const temp = document.createElement('template');
      temp.innerHTML = child.trim();
      node.append(...temp.content.childNodes);
    } else {
      node.append(document.createTextNode(child));
    }
  }
  return node;
}

/** Escape untrusted strings before inserting as HTML. */
export function esc(str = '') {
  return String(str).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

export function debounce(fn, wait = 250) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), wait); };
}

export function throttle(fn, wait = 100) {
  let last = 0, timer;
  return (...args) => {
    const now = Date.now();
    if (now - last >= wait) { last = now; fn(...args); }
    else { clearTimeout(timer); timer = setTimeout(() => { last = Date.now(); fn(...args); }, wait - (now - last)); }
  };
}

export const clamp = (n, min, max) => Math.min(Math.max(n, min), max);
export const round2 = (n) => Math.round((n + Number.EPSILON) * 100) / 100;

/** Read a query-string param safely. */
export function param(name) {
  try { return new URLSearchParams(location.search).get(name); } catch { return null; }
}

export function setParams(obj) {
  const url = new URL(location.href);
  Object.entries(obj).forEach(([k, v]) => {
    if (v === '' || v == null || (Array.isArray(v) && !v.length)) url.searchParams.delete(k);
    else url.searchParams.set(k, Array.isArray(v) ? v.join(',') : v);
  });
  history.replaceState({}, '', url);
}

/** Safe JSON parse from localStorage. */
export function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const val = JSON.parse(raw);
    return val == null ? fallback : val;
  } catch { return fallback; }
}

export function writeJSON(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); return true; }
  catch { return false; }
}

/** Build an Unsplash URL with sizing + fallback handling. */
export function img(id, w = 700) {
  return `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`;
}

/** Attach lazy loading, skeleton shimmer and a picsum fallback to an <img>. */
export function lazyImg(src, alt, cls = '') {
  const image = el('img', {
    src, alt, class: cls, loading: 'lazy', decoding: 'async',
    onerror: (e) => { e.target.onerror = null; e.target.src = `https://picsum.photos/seed/${encodeURIComponent(alt)}/700/525`; },
    onload: (e) => e.target.classList.add('loaded')
  });
  return image;
}

export function starsHTML(rating = 0) {
  let out = '';
  for (let i = 1; i <= 5; i++) out += `<i class="fa-star ${i <= Math.round(rating) ? 'fas' : 'far'}"></i>`;
  return `<span class="stars" aria-label="${rating} out of 5">${out} <span class="muted">(${rating.toFixed(1)})</span></span>`;
}

export function formatTime12(hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hr = h % 12 || 12;
  return `${hr}:${String(m).padStart(2, '0')} ${ampm}`;
}

/** Is the restaurant open right now given CONFIG.hours? */
export function isOpenNow(date = new Date()) {
  const today = CONFIG.hours.find((h) => h.day === date.getDay());
  if (!today) return { open: false, label: 'Closed' };
  const mins = date.getHours() * 60 + date.getMinutes();
  const toMin = (s) => { const [h, m] = s.split(':').map(Number); return h * 60 + m; };
  const open = toMin(today.open);
  let close = toMin(today.close);
  if (close <= open) close += 24 * 60; // crosses midnight
  const now = mins < open ? mins + 24 * 60 : mins;
  const isOpen = now >= open && now < close;
  return { open: isOpen, label: isOpen ? 'Open now' : 'Closed', closeAt: today.close };
}

/** Simple unique id. */
export const uid = () => Math.random().toString(36).slice(2, 10);

export function orderNumber() {
  return 'FB-' + Date.now().toString().slice(-6) + '-' + Math.floor(Math.random() * 90 + 10);
}

/** Animate a counter from 0 -> target. */
export function countUp(node, target, duration = 1600) {
  const start = performance.now();
  const isFloat = !Number.isInteger(target);
  function frame(now) {
    const p = clamp((now - start) / duration, 0, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    const val = target * eased;
    node.textContent = isFloat ? val.toFixed(1) : Math.round(val).toLocaleString();
    if (p < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

/** Observe elements with .reveal and add .in when visible. */
export function initReveal() {
  const items = $$('.reveal:not(.in)');
  if (!('IntersectionObserver' in window)) { items.forEach((n) => n.classList.add('in')); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  items.forEach((n) => io.observe(n));
}

export function scrollLock(lock) {
  document.body.style.overflow = lock ? 'hidden' : '';
}

export function on(sel, evt, handler, ctx = document) {
  ctx.addEventListener(evt, (e) => {
    const target = e.target.closest(sel);
    if (target) handler(e, target);
  });
}

/** Render a Font Awesome icon class string. */
export const fa = (name) => `<i class="fa-solid fa-${name}" aria-hidden="true"></i>`;
