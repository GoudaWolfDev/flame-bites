/** 404 page content. */
import { $ } from '../core/utils.js';
import { t } from '../core/i18n.js';

export async function init() {
  const main = $('#main');
  if (!main) return;
  main.innerHTML = `<div class="container section">
    <div class="empty-state" style="max-width:560px;margin-inline:auto">
      <div style="font-family:var(--font-head);font-size:clamp(5rem,18vw,10rem);line-height:1;background:var(--grad-red);-webkit-background-clip:text;background-clip:text;color:transparent">404</div>
      <h1>${t('p404.title')}</h1>
      <p>${t('p404.sub')}</p>
      <div class="flex gap-3 mt-4" style="justify-content:center">
        <a class="btn btn-primary btn-lg" href="index.html"><i class="fa-solid fa-house"></i> ${t('p404.btn')}</a>
        <a class="btn btn-outline btn-lg" href="menu.html"><i class="fa-solid fa-book-open"></i> ${t('nav.menu')}</a>
      </div>
    </div>
  </div>`;
}
