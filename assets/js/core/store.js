/**
 * Central reactive store. Persists to localStorage (defensively) and
 * mirrors writes across browser tabs via the `storage` event.
 */
import { readJSON, writeJSON, uid } from './utils.js';
import { CONFIG } from './config.js';

const K = {
  cart: 'fb_cart', fav: 'fb_fav', user: 'fb_user', orders: 'fb_orders',
  addr: 'fb_addr', res: 'fb_reservations', reviews: 'fb_reviews', coupon: 'fb_coupon'
};

const listeners = new Map();
export function on(evt, fn) {
  if (!listeners.has(evt)) listeners.set(evt, new Set());
  listeners.get(evt).add(fn);
  return () => listeners.get(evt).delete(fn);
}
function emit(evt, payload) { (listeners.get(evt) || []).forEach((fn) => fn(payload)); }

/* ---------------- Cart ---------------- */
let cart = readJSON(K.cart, []);
if (!Array.isArray(cart)) cart = [];

export const getCart = () => cart;
export const cartCount = () => cart.reduce((s, i) => s + i.qty, 0);
export const cartSubtotal = () => cart.reduce((s, i) => s + lineTotal(i), 0);

export function lineTotal(line) {
  const unit = (line.basePrice + (line.extras || []).reduce((s, e) => s + e.price, 0));
  return unit * line.qty;
}

function lineKey(item) {
  const extras = (item.extras || []).map((e) => e.name).sort().join('|');
  return [item.id, item.size || '', extras, item.notes || '', item.spice || ''].join('::');
}

/** Add a menu item (already configured) to the cart; merges identical lines. */
export function addToCart(item, qty = 1) {
  const key = lineKey(item);
  const existing = cart.find((l) => l.key === key);
  if (existing) existing.qty += qty;
  else cart.push({ ...item, key: key || uid(), qty });
  persistCart();
  emit('cart:add', item);
  return getCart();
}

export function updateQty(key, qty) {
  const line = cart.find((l) => l.key === key);
  if (!line) return;
  line.qty = Math.max(1, qty);
  persistCart();
}

export function removeFromCart(key) {
  cart = cart.filter((l) => l.key !== key);
  persistCart();
  emit('cart:remove', key);
}

export function clearCart() {
  cart = [];
  persistCart();
  emit('cart:clear');
}

function persistCart() {
  writeJSON(K.cart, cart);
  emit('cart:change', cart);
}

/* ---------------- Coupon ---------------- */
let coupon = readJSON(K.coupon, null);
export const getCoupon = () => coupon;
export function setCoupon(code) {
  const norm = (code || '').trim().toUpperCase();
  const def = CONFIG.coupons[norm];
  if (!def) { coupon = null; writeJSON(K.coupon, null); return null; }
  coupon = { code: norm, ...def };
  writeJSON(K.coupon, coupon);
  emit('coupon:change', coupon);
  return coupon;
}
export function clearCoupon() { coupon = null; writeJSON(K.coupon, null); emit('coupon:change', null); }

/** Compute the discount amount for the current coupon given a subtotal. */
export function discountFor(subtotal) {
  if (!coupon) return 0;
  if (coupon.type === 'percent') return Math.round(subtotal * (coupon.value / 100) * 100) / 100;
  if (coupon.type === 'delivery') return 0; // handled as free delivery
  return 0;
}

/* ---------------- Favorites ---------------- */
let fav = readJSON(K.fav, []);
if (!Array.isArray(fav)) fav = [];
export const getFavorites = () => fav;
export const isFavorite = (id) => fav.includes(id);
export function toggleFavorite(id) {
  const i = fav.indexOf(id);
  if (i >= 0) fav.splice(i, 1); else fav.push(id);
  writeJSON(K.fav, fav);
  emit('fav:change', fav);
  return i < 0;
}

/* ---------------- Auth / user ---------------- */
let user = readJSON(K.user, null);
export const getUser = () => user;
export const isLoggedIn = () => !!user;
export function setUser(u) { user = u; writeJSON(K.user, u); emit('user:change', user); }
export function logout() { user = null; writeJSON(K.user, null); emit('user:change', null); }

/* ---------------- Addresses ---------------- */
let addresses = readJSON(K.addr, []);
if (!Array.isArray(addresses)) addresses = [];
export const getAddresses = () => addresses;
export function addAddress(a) { addresses.push({ id: uid(), ...a }); writeJSON(K.addr, addresses); emit('addr:change', addresses); return addresses; }
export function removeAddress(id) { addresses = addresses.filter((a) => a.id !== id); writeJSON(K.addr, addresses); emit('addr:change', addresses); }

/* ---------------- Orders ---------------- */
let orders = readJSON(K.orders, []);
if (!Array.isArray(orders)) orders = [];
export const getOrders = () => orders;
export function addOrder(order) { orders.unshift(order); writeJSON(K.orders, orders); emit('order:change', orders); return order; }
export function updateOrderStatus(orderNo, status) {
  const o = orders.find((x) => x.orderNo === orderNo);
  if (o) { o.status = status; writeJSON(K.orders, orders); emit('order:change', orders); }
}
export function getOrder(orderNo) { return orders.find((x) => x.orderNo === orderNo) || null; }

/* ---------------- Reservations ---------------- */
let reservations = readJSON(K.res, []);
if (!Array.isArray(reservations)) reservations = [];
export const getReservations = () => reservations;
export function addReservation(r) { reservations.unshift({ id: uid(), ...r }); writeJSON(K.res, reservations); emit('res:change', reservations); return reservations; }

/* ---------------- Reviews ---------------- */
let reviews = readJSON(K.reviews, {});
if (typeof reviews !== 'object' || Array.isArray(reviews) || reviews === null) reviews = {};
export const getReviews = (itemId) => reviews[itemId] || [];
export function addReview(itemId, review) {
  reviews[itemId] = reviews[itemId] || [];
  reviews[itemId].unshift({ id: uid(), date: Date.now(), ...review });
  writeJSON(K.reviews, reviews);
  emit('review:change', { itemId });
}

/* ---------------- Recently viewed ---------------- */
let recent = readJSON('fb_recent', []);
if (!Array.isArray(recent)) recent = [];
export const getRecent = () => recent;
export function pushRecent(id) {
  recent = [id, ...recent.filter((x) => x !== id)].slice(0, 8);
  writeJSON('fb_recent', recent);
}

/* ---------------- Cross-tab sync ---------------- */
window.addEventListener('storage', (e) => {
  if (!e.key || !e.key.startsWith('fb_')) return;
  switch (e.key) {
    case K.cart: cart = readJSON(K.cart, []); if (!Array.isArray(cart)) cart = []; emit('cart:change', cart); break;
    case K.fav: fav = readJSON(K.fav, []); if (!Array.isArray(fav)) fav = []; emit('fav:change', fav); break;
    case K.user: user = readJSON(K.user, null); emit('user:change', user); break;
    case K.orders: orders = readJSON(K.orders, []); emit('order:change', orders); break;
    case K.coupon: coupon = readJSON(K.coupon, null); emit('coupon:change', coupon); break;
  }
});
