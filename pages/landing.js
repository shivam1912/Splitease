/**
 * pages/landing.js
 * Injects the Landing page HTML into #page-landing.
 */
document.getElementById('page-landing').innerHTML = `
  <div class="landing-noise"></div>
  <div class="glow-orb orb1"></div>
  <div class="glow-orb orb2"></div>
  <div class="glow-orb orb3"></div>

  <!-- NAV -->
  <nav class="landing-nav">
    <div class="flex items-center gap-3">
      <div style="background:var(--accent);width:34px;height:34px;border-radius:10px;display:flex;align-items:center;justify-content:center;">
        <i class="fas fa-bolt text-sm" style="color:#0e0f14"></i>
      </div>
      <span class="syne font-bold text-base" style="color:var(--text)">SplitEase</span>
    </div>
    <div class="hidden md:flex items-center gap-8">
      <a href="#features"     class="text-sm font-semibold" style="color:var(--muted);text-decoration:none;transition:0.2s" onmouseover="this.style.color='var(--text)'" onmouseout="this.style.color='var(--muted)'">Features</a>
      <a href="#stats"        class="text-sm font-semibold" style="color:var(--muted);text-decoration:none;transition:0.2s" onmouseover="this.style.color='var(--text)'" onmouseout="this.style.color='var(--muted)'">About</a>
      <a href="#testimonials" class="text-sm font-semibold" style="color:var(--muted);text-decoration:none;transition:0.2s" onmouseover="this.style.color='var(--text)'" onmouseout="this.style.color='var(--muted)'">Reviews</a>
    </div>
    <div class="flex items-center gap-3">
      <button class="btn-ghost"   style="padding:8px 18px;font-size:13px" onclick="showPage('auth');switchAuthTab('login')">Login</button>
      <button class="btn-primary" style="padding:8px 18px;font-size:13px" onclick="showPage('auth');switchAuthTab('register')">Get Started</button>
    </div>
  </nav>

  <!-- HERO -->
  <section class="hero">
    <div class="hero-badge"><i class="fas fa-star" style="font-size:10px"></i> Trusted by 50,000+ users across India</div>
    <h1 class="hero-title">Split bills.<br/><span class="grad">Zero friction.</span></h1>
    <p class="hero-sub">SplitEase makes sharing expenses with friends, roommates, and travel buddies effortless — with real-time tracking, smart reminders, and beautiful analytics.</p>
    <div class="hero-cta">
      <button class="btn-primary" style="padding:14px 32px;font-size:15px;border-radius:12px" onclick="showPage('auth');switchAuthTab('register')">
        <i class="fas fa-rocket mr-2"></i>Start for Free
      </button>
      <button class="btn-ghost" style="padding:14px 32px;font-size:15px;border-radius:12px" onclick="showPage('auth');switchAuthTab('login')">
        <i class="fas fa-sign-in-alt mr-2"></i>Sign In
      </button>
    </div>
    <!-- Mock dashboard preview -->
    <div style="margin-top:64px;width:100%;max-width:800px;border-radius:20px;border:1px solid var(--border);background:var(--surface);padding:20px;animation:fadeSlideUp 0.8s 0.5s ease both;box-shadow:0 40px 120px rgba(0,0,0,0.5);">
      <div style="display:flex;gap:8px;margin-bottom:16px;">
        <div style="width:12px;height:12px;border-radius:50%;background:#f87171;"></div>
        <div style="width:12px;height:12px;border-radius:50%;background:#fbbf24;"></div>
        <div style="width:12px;height:12px;border-radius:50%;background:#34d399;"></div>
      </div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:16px;">
        <div style="background:rgba(110,231,183,0.08);border:1px solid rgba(110,231,183,0.15);border-radius:12px;padding:14px;">
          <div style="font-size:11px;color:var(--muted);margin-bottom:6px;">You are owed</div>
          <div style="font-size:22px;font-weight:900;color:var(--accent)">₹4,250</div>
        </div>
        <div style="background:rgba(129,140,248,0.08);border:1px solid rgba(129,140,248,0.15);border-radius:12px;padding:14px;">
          <div style="font-size:11px;color:var(--muted);margin-bottom:6px;">You owe</div>
          <div style="font-size:22px;font-weight:900;color:var(--accent2)">₹1,800</div>
        </div>
        <div style="background:rgba(251,146,60,0.08);border:1px solid rgba(251,146,60,0.15);border-radius:12px;padding:14px;">
          <div style="font-size:11px;color:var(--muted);margin-bottom:6px;">Spent</div>
          <div style="font-size:22px;font-weight:900;color:var(--accent3)">₹21,600</div>
        </div>
      </div>
      <div style="height:80px;background:var(--surface2);border-radius:10px;display:flex;align-items:flex-end;padding:10px;gap:6px;overflow:hidden;">
        <div style="flex:1;background:rgba(129,140,248,0.4);border-radius:4px;height:40%"></div>
        <div style="flex:1;background:rgba(129,140,248,0.4);border-radius:4px;height:60%"></div>
        <div style="flex:1;background:rgba(129,140,248,0.4);border-radius:4px;height:50%"></div>
        <div style="flex:1;background:rgba(129,140,248,0.4);border-radius:4px;height:75%"></div>
        <div style="flex:1;background:rgba(129,140,248,0.4);border-radius:4px;height:55%"></div>
        <div style="flex:1;background:var(--accent);border-radius:4px;height:90%"></div>
      </div>
    </div>
  </section>

  <!-- FEATURES -->
  <section id="features" class="features">
    <div class="section-label">Everything you need</div>
    <h2 class="section-title">Built for how people<br/>actually split money</h2>
    <p style="color:var(--muted);max-width:500px;line-height:1.7">From weekend trips to monthly rent — SplitEase handles every scenario with elegance and precision.</p>
    <div class="feature-grid">
      <div class="feature-card"><div class="feature-icon" style="background:rgba(110,231,183,0.12);"><span>⚡</span></div><div class="feature-name">Instant Splitting</div><div class="feature-desc">Add an expense and split equally, by percentage, or exact amounts in seconds. No mental math required.</div></div>
      <div class="feature-card"><div class="feature-icon" style="background:rgba(129,140,248,0.12);"><span>📊</span></div><div class="feature-name">Rich Analytics</div><div class="feature-desc">Visualize your spending with beautiful charts — monthly trends, category breakdowns, and balance graphs.</div></div>
      <div class="feature-card"><div class="feature-icon" style="background:rgba(251,146,60,0.12);"><span>🔔</span></div><div class="feature-name">Smart Reminders</div><div class="feature-desc">Set automatic nudges for friends who owe you. No more awkward conversations.</div></div>
      <div class="feature-card"><div class="feature-icon" style="background:rgba(248,113,113,0.12);"><span>🎯</span></div><div class="feature-name">Budget Limits</div><div class="feature-desc">Set monthly spending limits per category. Get warned at 80% and alerted when you go over budget.</div></div>
      <div class="feature-card"><div class="feature-icon" style="background:rgba(56,189,248,0.12);"><span>👥</span></div><div class="feature-name">Groups & Friends</div><div class="feature-desc">Create groups for trips, flat expenses, or office lunches. Add members anytime and track group totals.</div></div>
      <div class="feature-card"><div class="feature-icon" style="background:rgba(251,191,36,0.12);"><span>🤝</span></div><div class="feature-name">One-tap Settle Up</div><div class="feature-desc">Record settlements via UPI, cash, or bank transfer. Balances update instantly across all your friends.</div></div>
    </div>
  </section>

  <!-- STATS -->
  <div id="stats" class="stats-bar">
    <div class="stats-inner">
      <div><div class="stat-num">50K+</div><div class="stat-lbl">Active Users</div></div>
      <div><div class="stat-num">₹2Cr+</div><div class="stat-lbl">Expenses Tracked</div></div>
      <div><div class="stat-num">99.9%</div><div class="stat-lbl">Uptime</div></div>
      <div><div class="stat-num">4.9★</div><div class="stat-lbl">User Rating</div></div>
    </div>
  </div>

  <!-- TESTIMONIALS -->
  <section id="testimonials" class="testimonials">
    <div class="section-label">What users say</div>
    <h2 class="section-title">Loved by thousands</h2>
    <div class="testimonial-grid">
      <div class="testimonial-card">
        <div class="t-stars">★★★★★</div>
        <p class="t-text">"Finally an app that doesn't make splitting Goa trip expenses feel like filing taxes. Beautiful UI and works flawlessly."</p>
        <div class="t-author"><div class="t-avatar" style="background:rgba(110,231,183,0.2);color:var(--accent)">RS</div><div><div style="font-size:13px;font-weight:700;">Rohit Sharma</div><div style="font-size:12px;color:var(--muted);">Software Engineer, Bangalore</div></div></div>
      </div>
      <div class="testimonial-card">
        <div class="t-stars">★★★★★</div>
        <p class="t-text">"The budget limit feature is a game changer. I finally know where my money goes every month. The charts are gorgeous."</p>
        <div class="t-author"><div class="t-avatar" style="background:rgba(129,140,248,0.2);color:var(--accent2)">PN</div><div><div style="font-size:13px;font-weight:700;">Priya Nair</div><div style="font-size:12px;color:var(--muted);">Product Manager, Mumbai</div></div></div>
      </div>
      <div class="testimonial-card">
        <div class="t-stars">★★★★★</div>
        <p class="t-text">"My flatmates and I used to argue about bills every month. SplitEase ended all of that. 10/10 recommend."</p>
        <div class="t-author"><div class="t-avatar" style="background:rgba(251,146,60,0.2);color:var(--accent3)">KM</div><div><div style="font-size:13px;font-weight:700;">Karan Mehta</div><div style="font-size:12px;color:var(--muted);">Designer, Delhi</div></div></div>
      </div>
    </div>
  </section>

  <footer class="landing-footer">© 2025 SplitEase · Made with ❤️ for splitting without stress</footer>
`;
