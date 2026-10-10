/** Theme (light/dark) persisted + system aware. */
import { readJSON, writeJSON } from './utils.js';

const KEY = 'fb_theme';
let theme = readJSON(KEY, null) || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
const listeners = new Set();

export function getTheme() { return theme; }

export function applyTheme(t) {
  theme = t;
  document.documentElement.setAttribute('data-theme', t);
  writeJSON(KEY, t);
  listeners.forEach((fn) => fn(t));
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', t === 'dark' ? '#121212' : '#DA291C');
}

export function toggleTheme() { applyTheme(theme === 'dark' ? 'light' : 'dark'); }

export function onThemeChange(fn) { listeners.add(fn); return () => listeners.delete(fn); }

applyTheme(theme);
