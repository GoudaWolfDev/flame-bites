/** Contact page: validated form, map, FAQ accordion. */
import { $, $$, el, esc } from '../core/utils.js';
import { t } from '../core/i18n.js';
import { CONFIG } from '../core/config.js';
import { BRANCHES } from '../data/branches.js';
import { toast } from '../components/toast.js';

const FAQ = [
  ['What are your delivery hours?', 'We deliver daily from 10:00 until our closing time, typically 23:00 on weekdays and 00:30 on weekends.'],
  ['Do you offer vegetarian options?', 'Yes — our Falafel Veggie Wrap and halloumi wrap are fully vegetarian, and many sides are plant-based.'],
  ['Is your meat halal?', 'Absolutely. 100% of our meat is certified halal and fully traceable.'],
  ['Can I schedule an order for later?', 'Yes. At checkout choose "Schedule for later" and pick your preferred time.'],
  ['How do I use a coupon?', 'Enter your code in the coupon box on the cart page before checking out.']
];

export async function init() {
  $('#main').innerHTML = `<div class="page-hero"><div class="container"><h1>${t('contact.title')}</h1><p>${t('contact.sub')}</p></div></div>
  <div class="container section">
    <div class="contact-grid">
      <div class="reveal">
        <div class="contact-info-card"><span class="ic"><i class="fa-solid fa-location-dot"></i></span><div><h3>Address</h3><p class="muted">${CONFIG.address}</p></div></div>
        <div class="contact-info-card"><span class="ic"><i class="fa-solid fa-phone"></i></span><div><h3>Phone</h3><p class="muted"><a href="${CONFIG.phoneHref}">${CONFIG.phone}</a></p></div></div>
        <div class="contact-info-card"><span class="ic"><i class="fa-solid fa-envelope"></i></span><div><h3>Email</h3><p class="muted"><a href="mailto:${CONFIG.email}">${CONFIG.email}</a></p></div></div>
        <form class="card" style="padding:24px;margin-top:12px" id="contactForm" novalidate>
          <div class="field"><label for="cName">${t('contact.name')} *</label><input id="cName" required><div class="error-msg">Required</div></div>
          <div class="field"><label for="cEmail">${t('checkout.email')} *</label><input id="cEmail" type="email" required><div class="error-msg">Invalid email</div></div>
          <div class="field"><label for="cSubject">Subject</label><input id="cSubject"></div>
          <div class="field"><label for="cMsg">${t('contact.message')} *</label><textarea id="cMsg" rows="4" required></textarea><div class="error-msg">Required</div></div>
          <button class="btn btn-primary btn-block" type="submit"><i class="fa-solid fa-paper-plane"></i> ${t('contact.send')}</button>
        </form>
      </div>
      <div class="reveal">
        <div class="contact-map"><iframe src="${BRANCHES[0].map}" title="Map" loading="lazy"></iframe></div>
        <div class="section-head" style="text-align:start;margin:32px 0 16px"><h2>${t('contact.faq')}</h2></div>
        <div class="accordion" id="faq">
          ${FAQ.map(([q, a], i) => `<div class="acc-item ${i === 0 ? 'open' : ''}"><button class="acc-trigger">${esc(q)}<i class="fa-solid fa-chevron-down"></i></button><div class="acc-panel"><div class="inner">${esc(a)}</div></div></div>`).join('')}
        </div>
      </div>
    </div>
  </div>`;

  // FAQ accordion
  $$('#faq .acc-trigger').forEach((tr) => tr.addEventListener('click', () => {
    const item = tr.parentElement;
    const panel = item.querySelector('.acc-panel');
    const open = item.classList.toggle('open');
    panel.style.maxHeight = open ? panel.scrollHeight + 'px' : 0;
  }));
  $$('#faq .acc-item.open .acc-panel').forEach((p) => { p.style.maxHeight = p.scrollHeight + 'px'; });

  $('#contactForm').addEventListener('submit', (e) => {
    e.preventDefault();
    let ok = true;
    const mark = (id, bad) => { $(id).closest('.field').classList.toggle('invalid', bad); ok = ok && !bad; };
    mark('#cName', $('#cName').value.trim().length < 2);
    mark('#cEmail', !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test($('#cEmail').value));
    mark('#cMsg', $('#cMsg').value.trim().length < 5);
    if (!ok) { toast('Please fix the highlighted fields', 'error'); return; }
    toast('Message sent! We will get back to you soon.', 'success');
    e.target.reset();
  });
}
