/**
 * boot.js
 * Entry point — runs after ALL modules and page templates are loaded
 * (it is the last <script> tag in index.html).
 *
 * By the time this runs, pages/landing.js, pages/auth.js, pages/app.js,
 * and pages/modals.js have already injected their HTML, so it is safe
 * to query any element in the DOM.
 */
(function () {
  // Wire up scroll-reveal now that landing HTML exists
  initScrollReveal();

  // Session check — go straight to app or show landing
  const user = Auth.currentUser();
  if (user) {
    launchApp(user);
  } else {
    showPage('landing');
  }
})();
