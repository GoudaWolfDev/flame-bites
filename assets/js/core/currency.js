/** Currency conversion + formatting with a persisted switcher. */
import { CONFIG } from './config.js';
import { round2, readJSON, writeJSON } from './utils.js';

const RATES = {
  EGP: { rate: 1, symbol: 'EGP', prefix: false },
  USD: { rate: 1 / 48, symbol: '$', prefix: true },
  EUR: { rate: 1 / 52, symbol: '€', prefix: true }
};

let current = readJSON('fb_currency', CONFIG.currency);
const listeners = new Set();

export function getCurrency() { return current; }

export function setCurrency(code) {
  if (!RATES[code]) return;
  current = code;
  writeJSON('fb_currency', code);
  listeners.forEach((fn) => fn(code));
}

export function onCurrencyChange(fn) { listeners.add(fn); return () => listeners.delete(fn); }

/** Convert an EGP base price to the active currency. */
export function convert(egp) {
  const c = RATES[current] || RATES.EGP;
  return round2(egp * c.rate);
}

/** Format an EGP base amount for display in the active currency. */
export function money(egp) {
  const c = RATES[current] || RATES.EGP;
  const val = convert(egp);
  const str = current === 'EGP' ? Math.round(val).toLocaleString() : val.toFixed(2);
  return c.prefix ? `${c.symbol}${str}` : `${str} ${c.symbol}`;
}

export const currencyList = Object.keys(RATES);
