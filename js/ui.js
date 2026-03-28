/**
 * ui.js
 * Page/section navigation, toast notifications, modal helpers,
 * and auth-form UI logic.
 * Depends on: helpers.js, state.js, auth.js
 */

/* ============================================================
   PAGE NAVIGATION
   ============================================================ */

/**
 * Shows the named top-level page and hides all others.
 * Uses !important-backed CSS + inline style to guarantee hide/show.
 * @param {'landing'|'auth'|'app'} name
 */
function showPage(name) {
  document.querySelectorAll('.page').forEach(p => {
    p.classList.remove('active');
  });
  const pg = document.getElementById('page-' + name);
  if (pg) pg.classList.add('active');
  window.scrollTo(0, 0);
}

/**
 * Shows a named section INSIDE the app page.
 * Scoped to #page-app so it never touches landing sections.
 * @param {string}  name - section id suffix (e.g. 'dashboard')
 * @param {Element} [el] - the nav-item element that was clicked
 */
function showSection(name, el, skipRender = false) {
  // Only touch sections inside the app shell
  document.querySelectorAll('#page-app .section').forEach(s => s.classList.remove('active'));

  const sec = document.getElementById('sec-' + name);
  if (sec) sec.classList.add('active');

  // Update sidebar active state
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  if (el) el.classList.add('active');

  // Close mobile sidebar if open
  if (window.innerWidth <= 768) {
    const sb = document.getElementById('sidebar');
    const ov = document.getElementById('sidebar-overlay');
    if (sb) sb.classList.remove('mobile-open');
    if (ov) ov.style.display = 'none';
  }

  if (!skipRender) {
    renderAll();
    if (name === 'analytics') setTimeout(renderAnalyticsCharts, 80);
    if (name === 'dashboard')  setTimeout(renderDashboardCharts,  80);
  }
}

/**
 * Toggles the mobile sidebar open/closed.
 */
function toggleSidebar() {
  const sb = document.getElementById('sidebar');
  const ov = document.getElementById('sidebar-overlay');
  if (!sb) return;
  sb.classList.toggle('mobile-open');
  if (ov) ov.style.display = sb.classList.contains('mobile-open') ? 'block' : 'none';
}

/* ============================================================
   SMOOTH SCROLL for landing anchor links
   Event delegation so it works after pages/landing.js injects HTML.
   ============================================================ */
document.addEventListener('click', function (e) {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;
  e.preventDefault();
  const target = document.getElementById(link.getAttribute('href').substring(1));
  if (target) {
    const y = target.getBoundingClientRect().top + window.pageYOffset - 70;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }
});

/**
 * Wires up the scroll-reveal IntersectionObserver for the landing page.
 * Called from boot.js after all page templates have been injected.
 */
function initScrollReveal() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('show');
    });
  }, { threshold: 0.15 });
  // Only observe landing-page sections to avoid interfering with app sections
  document.querySelectorAll('#page-landing .section').forEach(s => observer.observe(s));
}

/* ============================================================
   TOAST
   ============================================================ */
let toastTimer;

/**
 * Shows a short-lived toast notification.
 * @param {string} msg
 * @param {string} [icon='✅']
 */
function showToast(msg, icon = '✅') {
  const t = document.getElementById('toast');
  document.getElementById('toast-msg').textContent  = msg;
  document.getElementById('toast-icon').textContent = icon;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2800);
}

/* ============================================================
   MODALS
   ============================================================ */

/** Opens a modal overlay by its element id */
function openModal(id) {
  refreshModalData();
  const m = document.getElementById(id);
  if (m) m.classList.add('open');
}

/** Closes a modal overlay by its element id */
function closeModal(id) {
  const m = document.getElementById(id);
  if (m) m.classList.remove('open');
}

// Close modal when clicking the dark overlay behind it (event delegation)
document.addEventListener('click', function (e) {
  if (e.target.classList.contains('modal-overlay')) closeModal(e.target.id);
});

/* ============================================================
   AUTH FORM UI
   ============================================================ */

/**
 * Switches between the Sign In and Create Account tabs.
 * @param {'login'|'register'} tab
 */
function switchAuthTab(tab) {
  const loginForm    = document.getElementById('auth-login');
  const registerForm = document.getElementById('auth-register');
  const tabLogin     = document.getElementById('tab-login');
  const tabRegister  = document.getElementById('tab-register');

  if (loginForm)    loginForm.style.display    = tab === 'login'    ? 'block' : 'none';
  if (registerForm) registerForm.style.display = tab === 'register' ? 'block' : 'none';
  if (tabLogin)     tabLogin.className    = 'auth-tab' + (tab === 'login'    ? ' active' : '');
  if (tabRegister)  tabRegister.className = 'auth-tab' + (tab === 'register' ? ' active' : '');
  clearAuthErrors();
}

/** Clears all inline auth error messages and removes error styling */
function clearAuthErrors() {
  ['login-email', 'login-password',
   'reg-name', 'reg-email', 'reg-password', 'reg-confirm'
  ].forEach(id => {
    const errEl   = document.getElementById(id + '-err');
    if (errEl)   { errEl.style.display = 'none'; errEl.textContent = ''; }
    const inputEl = document.getElementById(id);
    if (inputEl && inputEl.classList) inputEl.classList.remove('input-error');
  });
  const ge = document.getElementById.bind(document);
  ['login-general-err', 'reg-general-err'].forEach(id => {
    const el = ge(id); if (el) { el.style.display = 'none'; el.textContent = ''; }
  });
}

/**
 * Marks a field as invalid and shows a message below it.
 * @param {string} fieldId
 * @param {string} msg
 */
function showAuthError(fieldId, msg) {
  const errEl   = document.getElementById(fieldId + '-err');
  if (errEl)   { errEl.textContent = msg; errEl.style.display = 'block'; }
  const inputEl = document.getElementById(fieldId);
  if (inputEl && inputEl.classList) inputEl.classList.add('input-error');
}

/* ============================================================
   AUTH ACTIONS
   ============================================================ */

/** Handles the login form submission */
function doLogin() {
  clearAuthErrors();
  const emailEl = document.getElementById('login-email');
  const passEl  = document.getElementById('login-password');
  if (!emailEl || !passEl) return;

  const email    = emailEl.value.trim();
  const password = passEl.value;
  let valid = true;

  if (!email)    { showAuthError('login-email',    'Email is required');    valid = false; }
  if (!password) { showAuthError('login-password', 'Password is required'); valid = false; }
  if (!valid) return;

  const result = Auth.login(email, password);
  if (!result.success) {
    showAuthError('login-' + (result.field === 'email' ? 'email' : 'password'), result.msg);
    return;
  }
  launchApp(result.user);
}

/** Handles the registration form submission */
function doRegister() {
  clearAuthErrors();
  const ge = id => document.getElementById(id);
  const name     = ge('reg-name')    ? ge('reg-name').value.trim()     : '';
  const email    = ge('reg-email')   ? ge('reg-email').value.trim()    : '';
  const password = ge('reg-password')? ge('reg-password').value        : '';
  const confirm  = ge('reg-confirm') ? ge('reg-confirm').value         : '';
  const phone    = ge('reg-phone')   ? ge('reg-phone').value.trim()    : '';
  let valid = true;

  if (!name)    { showAuthError('reg-name',     'Name is required');        valid = false; }
  if (!email)   { showAuthError('reg-email',    'Email is required');       valid = false; }
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
                { showAuthError('reg-email',    'Enter a valid email');     valid = false; }
  if (!password){ showAuthError('reg-password', 'Password is required');   valid = false; }
  else if (password.length < 6)
                { showAuthError('reg-password', 'Minimum 6 characters');   valid = false; }
  if (password && confirm !== password)
                { showAuthError('reg-confirm',  'Passwords do not match'); valid = false; }
  if (!valid) return;

  const result = Auth.register(name, email, password, phone);
  if (!result.success) { showAuthError('reg-' + result.field, result.msg); return; }
  showToast('🎉 Account created! Welcome to SplitEase');
  launchApp(result.user);
}
