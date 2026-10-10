/** Bilingual EN/AR engine with full RTL support. */
import { TRANSLATIONS } from '../data/translations.js';
import { readJSON, writeJSON, $$ } from './utils.js';

const KEY = 'fb_lang';
let lang = readJSON(KEY, 'en');
if (!TRANSLATIONS[lang]) lang = 'en';
const listeners = new Set();

export function getLang() { return lang; }
export function isRTL() { return lang === 'ar'; }

export function t(key, vars) {
  const dict = TRANSLATIONS[lang] || TRANSLATIONS.en;
  let str = dict[key] ?? TRANSLATIONS.en[key] ?? key;
  if (vars) str = str.replace(/\{(\w+)\}/g, (_, k) => (vars[k] ?? ''));
  return str;
}

export function applyLang(l) {
  lang = TRANSLATIONS[l] ? l : 'en';
  writeJSON(KEY, lang);
  document.documentElement.lang = lang;
  document.documentElement.dir = isRTL() ? 'rtl' : 'ltr';
  document.documentElement.setAttribute('data-lang', lang);
  // Translate any [data-i18n] nodes, and [data-i18n-ph] placeholders.
  $$('[data-i18n]').forEach((n) => { n.textContent = t(n.dataset.i18n); });
  $$('[data-i18n-ph]').forEach((n) => { n.setAttribute('placeholder', t(n.dataset.i18nPh)); });
  $$('[data-i18n-aria]').forEach((n) => { n.setAttribute('aria-label', t(n.dataset.i18nAria)); });
  listeners.forEach((fn) => fn(lang));
}

export function setLang(l) { applyLang(l); }

export function toggleLang() { applyLang(isRTL() ? 'en' : 'ar'); }

export function onLangChange(fn) { listeners.add(fn); return () => listeners.delete(fn); }

applyLang(lang);
