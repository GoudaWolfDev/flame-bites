/** Injected site footer with validated newsletter. */
import { CONFIG } from '../core/config.js';
import { $, el, esc } from '../core/utils.js';
import { t } from '../core/i18n.js';
import { toast } from './toast.js';
import { LOGO_SVG } from './header.js';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function mountFooter() {
  const host = $('#site-footer');
  if (!host) return;
  const quick = [
    ['menu.html', 'nav.menu'], ['offers.html', 'nav.offers'], ['reservation.html', 'nav.reservation'],
    ['branches.html', 'nav.branches'], ['about.html', 'nav.about'], ['contact.html', 'nav.contact']
  ];
  host.innerHTML = `
  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div>
          <a class="logo" href="index.html" style="color:#fff">${LOGO_SVG}<span class="wordmark"><span class="flame">FLAME</span> <span class="bites">BITES</span></span></a>
          <p style="margin-top:14px;opacity:.85">${CONFIG.description}</p>
          <div class="socials">
            <a href="${CONFIG.social.facebook}" target="_blank" rel="noopener" aria-label="Facebook"><i class="fa-brands fa-facebook-f"></i></a>
            <a href="${CONFIG.social.instagram}" target="_blank" rel="noopener" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
            <a href="${CONFIG.social.twitter}" target="_blank" rel="noopener" aria-label="Twitter"><i class="fa-brands fa-x-twitter"></i></a>
            <a href="${CONFIG.social.youtube}" target="_blank" rel="noopener" aria-label="YouTube"><i class="fa-brands fa-youtube"></i></a>
          </div>
        </div>
        <div>
          <h4>${t('footer.quickLinks')}</h4>
          <ul class="footer-links">${quick.map(([h, k]) => `<li><a href="${h}">${t(k)}</a></li>`).join('')}</ul>
        </div>
        <div>
          <h4>${t('footer.hours')}</h4>
          <ul class="footer-hours">
            ${CONFIG.hours.map((h) => `<li><span>${DAYS[h.day]}</span><span>${h.open}–${h.close}</span></li>`).join('')}
          </ul>
        </div>
        <div>
          <h4>${t('footer.contact')}</h4>
          <ul class="footer-links">
            <li><i class="fa-solid fa-location-dot"></i> ${CONFIG.address}</li>
            <li><a href="${CONFIG.phoneHref}"><i class="fa-solid fa-phone"></i> ${CONFIG.phone}</a></li>
            <li><a href="mailto:${CONFIG.email}"><i class="fa-solid fa-envelope"></i> ${CONFIG.email}</a></li>
          </ul>
          <h4 style="margin-top:18px">${t('footer.newsletter')}</h4>
          <form class="newsletter" id="newsletterForm" novalidate>
            <div class="field">
              <input type="email" id="newsletterEmail" placeholder="${t('common.emailPlaceholder')}" aria-label="${t('common.emailPlaceholder')}" required>
            </div>
            <button class="btn btn-secondary btn-block" type="submit">${t('common.subscribe')}</button>
          </form>
          <div class="store-badges">
            <a href="${CONFIG.appLinks.apple}" aria-label="App Store"><i class="fa-brands fa-apple"></i> App Store</a>
            <a href="${CONFIG.appLinks.google}" aria-label="Google Play"><i class="fa-brands fa-google-play"></i> Google Play</a>
          </div>
        </div>
      </div>
      <div class="payments" aria-label="Accepted payments">
        <i class="fa-brands fa-cc-visa"></i><i class="fa-brands fa-cc-mastercard"></i><i class="fa-brands fa-cc-paypal"></i><i class="fa-solid fa-money-bill-wave"></i><i class="fa-solid fa-wallet"></i>
      </div>
      <div class="footer-bottom">
        <span>© ${new Date().getFullYear()} ${CONFIG.name}. ${t('footer.rights')}</span>
        <span>${t('footer.madeWith')} <i class="fa-solid fa-fire" style="color:var(--yellow-primary)"></i> · <a href="#">Privacy</a> · <a href="#">Terms</a></span>
      </div>
    </div>
  </footer>`;

  const form = $('#newsletterForm');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = $('#newsletterEmail');
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value);
    if (!ok) { toast(t('toast.emailInvalid'), 'error'); input.focus(); return; }
    toast(t('toast.subscribed'), 'success');
    input.value = '';
  });
}
