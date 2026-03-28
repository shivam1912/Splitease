/**
 * app.js
 * Top-level app lifecycle: launch, logout, sidebar/settings user display.
 * Depends on: auth.js, state.js, helpers.js, ui.js, render.js, charts.dashboard.js
 */

/**
 * Initialises the app for a logged-in user.
 * Order matters:
 *   1. Show the app page
 *   2. Load state from storage  ← must happen before any render
 *   3. Update sidebar & settings UI
 *   4. Activate dashboard section (which internally calls renderAll)
 *   5. Render charts (async, after DOM has painted)
 *   6. Set greeting text
 */
function launchApp(user) {
  // 1. Switch to app page
  showPage('app');

  // 2. Load persisted state FIRST — everything below reads from `state`
  state = AppData.load();

  // 3. Populate sidebar user chip and settings profile fields
  updateSidebarUser(user);
  updateSettingsUser(user);

  // 4. Activate the dashboard section and its nav-item, then renderAll once
  const firstNavItem = document.querySelector('#sidebar .nav-item');
  showSection('dashboard', firstNavItem, true); // skipRender=true — we call renderAll below

  // 4b. Now render everything once with fully-loaded state
  renderAll();

  // 5. Render charts after the DOM has painted
  setTimeout(renderDashboardCharts, 120);

  // 6. Greeting + date
  const hour    = new Date().getHours();
  const greet   = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const greetEl = document.getElementById('dash-greeting');
  if (greetEl) greetEl.textContent = `${greet}, ${user.name.split(' ')[0]} 👋`;

  const dateEl = document.getElementById('dash-date');
  if (dateEl) dateEl.textContent = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
}

/**
 * Logs out: destroys charts, resets state, clears session, returns to landing.
 */
function logout() {
  Object.keys(charts).forEach(k => { try { charts[k].destroy(); } catch (e) {} });
  charts = {};
  state  = AppData.createEmpty();
  Auth.logout();
  showPage('landing');
}

/**
 * Updates the sidebar user profile chip.
 * @param {object} user
 */
function updateSidebarUser(user) {
  const av = document.getElementById('sidebar-avatar');
  const sn = document.getElementById('sidebar-name');
  const se = document.getElementById('sidebar-email');
  if (av) av.textContent = getInitials(user.name);
  if (sn) sn.textContent = user.name;
  if (se) se.textContent = user.email;
}

/**
 * Populates the Settings > Profile card with the user's current data.
 * @param {object} user
 */
function updateSettingsUser(user) {
  const fields = {
    'settings-avatar':        el => el.textContent = getInitials(user.name),
    'settings-name-display':  el => el.textContent = user.name,
    'settings-email-display': el => el.textContent = user.email,
    'profile-name':           el => el.value = user.name,
    'profile-email':          el => el.value = user.email,
    'profile-phone':          el => el.value = user.phone || '',
  };
  Object.entries(fields).forEach(([id, fn]) => {
    const el = document.getElementById(id);
    if (el) fn(el);
  });
}
