/** Login / Register page with strength meter and guest checkout. */
import { $, $$, readJSON, writeJSON } from '../core/utils.js';
import { t } from '../core/i18n.js';
import { setUser, getUser } from '../core/store.js';
import { toast } from '../components/toast.js';

const USERS_KEY = 'fb_users';

function strength(pw) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[a-z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return Math.min(s, 5);
}

export async function init() {
  if (getUser()) { location.replace('account.html'); return; }
  $('#main').innerHTML = `<div class="container">
    <div class="auth-wrap">
      <div class="auth-tabs">
        <button class="active" data-tab="login">${t('auth.login')}</button>
        <button data-tab="register">${t('auth.register')}</button>
      </div>
      <div class="auth-panel active" data-panel="login">
        <form id="loginForm" novalidate>
          <div class="field"><label for="lEmail">${t('auth.email')}</label><input id="lEmail" type="email" required><div class="error-msg">Invalid email</div></div>
          <div class="field pw-field"><label for="lPass">${t('auth.password')}</label><input id="lPass" type="password" required><button type="button" class="pw-toggle" data-toggle="lPass" aria-label="${t('auth.showPassword')}"><i class="fa-solid fa-eye"></i></button><div class="error-msg">Required</div></div>
          <div class="flex between center"><label class="flex center gap-2" style="font-weight:400;font-size:.9rem"><input type="checkbox" id="lRemember"> ${t('auth.remember')}</label><a href="#" class="muted" style="font-size:.85rem">${t('auth.forgot')}</a></div>
          <button class="btn btn-primary btn-block mt-4" type="submit">${t('auth.login')}</button>
          <a class="btn btn-outline btn-block mt-2" href="menu.html">${t('auth.guest')}</a>
          <p class="text-center muted mt-4" style="font-size:.88rem">${t('auth.noAccount')} <a href="#" data-goto="register" style="color:var(--red-primary);font-weight:600">${t('auth.register')}</a></p>
        </form>
      </div>
      <div class="auth-panel" data-panel="register">
        <form id="registerForm" novalidate>
          <div class="field"><label for="rName">${t('auth.fullName')}</label><input id="rName" required><div class="error-msg">Required</div></div>
          <div class="field"><label for="regEmail">${t('auth.email')}</label><input id="regEmail" type="email" required><div class="error-msg">Invalid email</div></div>
          <div class="field pw-field"><label for="regPass">${t('auth.password')}</label><input id="regPass" type="password" required><button type="button" class="pw-toggle" data-toggle="regPass" aria-label="${t('auth.showPassword')}"><i class="fa-solid fa-eye"></i></button>
            <div class="strength-meter"><div class="bar" id="strengthBar"></div></div><small class="muted" id="strengthText">Use 8+ chars with numbers & symbols</small><div class="error-msg">Min 6 characters</div></div>
          <div class="field"><label for="regPass2">${t('auth.confirmPassword')}</label><input id="regPass2" type="password" required><div class="error-msg">Passwords do not match</div></div>
          <button class="btn btn-primary btn-block mt-4" type="submit">${t('auth.register')}</button>
          <p class="text-center muted mt-4" style="font-size:.88rem">${t('auth.haveAccount')} <a href="#" data-goto="login" style="color:var(--red-primary);font-weight:600">${t('auth.login')}</a></p>
        </form>
      </div>
    </div>
  </div>`;

  // tabs
  $$('.auth-tabs button').forEach((b) => b.addEventListener('click', () => switchTab(b.dataset.tab)));
  $$('[data-goto]').forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); switchTab(a.dataset.goto); }));
  function switchTab(name) {
    $$('.auth-tabs button').forEach((x) => x.classList.toggle('active', x.dataset.tab === name));
    $$('.auth-panel').forEach((p) => p.classList.toggle('active', p.dataset.panel === name));
  }

  // password toggles
  $$('.pw-toggle').forEach((b) => b.addEventListener('click', () => {
    const input = $('#' + b.dataset.toggle);
    const show = input.type === 'password';
    input.type = show ? 'text' : 'password';
    b.querySelector('i').className = `fa-solid fa-eye${show ? '-slash' : ''}`;
  }));

  // strength
  const bar = $('#strengthBar'), txt = $('#strengthText');
  const COLORS = ['#e53935', '#e53935', '#fb8c00', '#fdd835', '#43a047', '#2e7d32'];
  const LABELS = ['Very weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very strong'];
  $('#regPass').addEventListener('input', (e) => {
    const s = strength(e.target.value);
    bar.style.width = (s / 5 * 100) + '%';
    bar.style.background = COLORS[s];
    txt.textContent = e.target.value ? LABELS[s] : 'Use 8+ chars with numbers & symbols';
  });

  // login
  $('#loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = $('#lEmail'), pass = $('#lPass');
    let ok = true;
    ok = mark(email, !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) && ok;
    ok = mark(pass, pass.value.length < 6) && ok;
    if (!ok) return;
    const users = readJSON(USERS_KEY, {});
    const u = users[email.value.toLowerCase()];
    if (u && u.password === pass.value) {
      setUser({ name: u.name, email: email.value.toLowerCase(), phone: u.phone || '' });
      toast(t('toast.loginOk'), 'success');
      location.href = 'account.html';
    } else if (!u) {
      toast('No account found — try registering.', 'error');
    } else {
      toast('Incorrect password.', 'error');
    }
  });

  // register
  $('#registerForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = $('#rName'), email = $('#regEmail'), pass = $('#regPass'), pass2 = $('#regPass2');
    let ok = true;
    ok = mark(name, name.value.trim().length < 2) && ok;
    ok = mark(email, !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) && ok;
    ok = mark(pass, pass.value.length < 6) && ok;
    ok = mark(pass2, pass2.value !== pass.value) && ok;
    if (!ok) return;
    const users = readJSON(USERS_KEY, {});
    users[email.value.toLowerCase()] = { name: name.value.trim(), password: pass.value, phone: '' };
    writeJSON(USERS_KEY, users);
    setUser({ name: name.value.trim(), email: email.value.toLowerCase(), phone: '' });
    toast(t('toast.registerOk'), 'success');
    location.href = 'account.html';
  });

  function mark(input, bad) { input.closest('.field').classList.toggle('invalid', bad); return !bad; }
}
