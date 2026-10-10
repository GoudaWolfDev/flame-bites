/** Reusable slider/carousel with autoplay, arrows, dots and touch swipe. */
import { $, $$, el } from '../core/utils.js';

/**
 * @param {HTMLElement} root - element containing `.slider-track` and `.slider-slide`s
 * @param {{autoplay?:boolean, interval?:number, dots?:boolean, arrows?:boolean, swipe?:boolean, perView?:number}} opts
 */
export function createSlider(root, opts = {}) {
  const { autoplay = false, interval = 5000, dots = true, arrows = true, swipe = true, perView = 1 } = opts;
  if (!root) return { goTo() {}, next() {}, prev() {} };
  const track = $('.slider-track', root) || root;
  const slides = $$('.slider-slide', root);
  let index = 0, timer = null, startX = 0;

  const dotsWrap = dots ? el('div', { class: 'slider-dots', role: 'tablist' }) : null;
  if (dotsWrap) root.append(dotsWrap);

  slides.forEach((s, i) => {
    s.setAttribute('role', 'group');
    s.setAttribute('aria-label', `Slide ${i + 1} of ${slides.length}`);
    if (dotsWrap) dotsWrap.append(el('button', {
      'aria-label': `Go to slide ${i + 1}`, class: i === 0 ? 'active' : '',
      onclick: () => goTo(i)
    }));
  });

  if (arrows && slides.length > 1) {
    root.append(
      el('button', { class: 'slider-btn prev', 'aria-label': 'Previous slide', onclick: prev }, el('i', { class: 'fa-solid fa-chevron-left' })),
      el('button', { class: 'slider-btn next', 'aria-label': 'Next slide', onclick: next }, el('i', { class: 'fa-solid fa-chevron-right' }))
    );
  }

  function render() {
    track.style.transform = `translateX(${index * -100}%)`;
    slides.forEach((s, i) => s.classList.toggle('active', i === index));
    if (dotsWrap) $$('button', dotsWrap).forEach((d, i) => d.classList.toggle('active', i === index));
    root.querySelectorAll('.slider-btn').forEach((b) => { b.disabled = false; });
  }
  function goTo(i) { index = (i + slides.length) % slides.length; render(); restart(); }
  function next() { goTo(index + 1); }
  function prev() { goTo(index - 1); }
  function restart() { if (!autoplay) return; clearInterval(timer); timer = setInterval(next, interval); }

  if (slides.length > 1) {
    root.addEventListener('mouseenter', () => clearInterval(timer));
    root.addEventListener('mouseleave', restart);
    root.addEventListener('focusin', () => clearInterval(timer));
    if (swipe) {
      root.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
      root.addEventListener('touchend', (e) => {
        const dx = e.changedTouches[0].clientX - startX;
        if (Math.abs(dx) > 40) dx < 0 ? next() : prev();
      });
      root.addEventListener('pointerdown', (e) => { startX = e.clientX; });
      root.addEventListener('pointerup', (e) => {
        const dx = e.clientX - startX;
        if (Math.abs(dx) > 60) dx < 0 ? next() : prev();
      });
    }
  }

  render();
  restart();
  return { goTo, next, prev, get index() { return index; } };
}
