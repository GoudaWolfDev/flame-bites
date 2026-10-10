/** Countdown timers for deals/offers. */

function parts(ms) {
  ms = Math.max(0, ms);
  return {
    d: Math.floor(ms / 86400000),
    h: Math.floor((ms % 86400000) / 3600000),
    m: Math.floor((ms % 3600000) / 60000),
    s: Math.floor((ms % 60000) / 1000)
  };
}

/** Build the markup for a countdown box. */
export function countdownHTML() {
  return ['d', 'h', 'm', 's'].map((k) =>
    `<div class="cd-unit"><span data-cd="${k}">00</span><small>${k === 'd' ? 'Days' : k === 'h' ? 'Hours' : k === 'm' ? 'Mins' : 'Secs'}</small></div>`
  ).join('');
}

/**
 * Live countdown inside `node`. Returns a stop function.
 * @param {HTMLElement} node
 * @param {number} targetTime - epoch ms
 */
export function createCountdown(node, targetTime) {
  if (!node) return () => {};
  function tick() {
    const t = parts(targetTime - Date.now());
    const set = (k, v) => { const n = node.querySelector(`[data-cd="${k}"]`); if (n) n.textContent = String(v).padStart(2, '0'); };
    set('d', t.d); set('h', t.h); set('m', t.m); set('s', t.s);
    if (targetTime - Date.now() <= 0) { node.querySelectorAll('.cd-unit').forEach((u) => u.style.opacity = '.4'); return true; }
    return false;
  }
  if (tick()) return () => {};
  const id = setInterval(() => { if (tick()) clearInterval(id); }, 1000);
  return () => clearInterval(id);
}

/** End of the current day (midnight) — used for "today's deals". */
export function endOfDay() {
  const d = new Date();
  d.setHours(23, 59, 59, 999);
  return d.getTime();
}
