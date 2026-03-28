/**
 * pages/auth.js
 * Injects the Auth (login / register) page HTML into #page-auth.
 */
document.getElementById('page-auth').innerHTML = `
  <div class="auth-orb1"></div>
  <div class="auth-orb2"></div>

  <div style="position:relative;z-index:1;width:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;padding:24px;">
    <!-- Logo -->
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:32px;">
      <div style="background:var(--accent);width:38px;height:38px;border-radius:12px;display:flex;align-items:center;justify-content:center;">
        <i class="fas fa-bolt" style="color:#0e0f14"></i>
      </div>
      <span class="syne font-bold text-xl" style="color:var(--text)">SplitEase</span>
    </div>

    <!-- Card -->
    <div class="auth-card">
      <div class="auth-tab-bar">
        <div class="auth-tab active" id="tab-login"    onclick="switchAuthTab('login')">Sign In</div>
        <div class="auth-tab"        id="tab-register" onclick="switchAuthTab('register')">Create Account</div>
      </div>

      <!-- LOGIN FORM -->
      <div id="auth-login">
        <h2 class="text-xl font-extrabold serif mb-1">Welcome back</h2>
        <p class="text-sm mb-6" style="color:var(--muted)">Sign in to your SplitEase account</p>
        <div class="space-y-4">
          <div>
            <label>Email</label>
            <input class="input" id="login-email" type="email" placeholder="you@email.com" onkeydown="if(event.key==='Enter')doLogin()"/>
            <div id="login-email-err" class="error-msg" style="display:none"></div>
          </div>
          <div>
            <label>Password</label>
            <input class="input" id="login-password" type="password" placeholder="Your password" onkeydown="if(event.key==='Enter')doLogin()"/>
            <div id="login-password-err" class="error-msg" style="display:none"></div>
          </div>
          <div id="login-general-err" class="error-msg" style="display:none"></div>
          <button class="btn-primary w-full mt-2" onclick="doLogin()">
            <i class="fas fa-sign-in-alt mr-2"></i>Sign In
          </button>
        </div>
        <p class="text-center text-sm mt-5" style="color:var(--muted)">
          No account?
          <span class="font-bold cursor-pointer" style="color:var(--accent)" onclick="switchAuthTab('register')">Create one →</span>
        </p>
        <button class="btn-ghost w-full mt-3" style="font-size:13px" onclick="showPage('landing')">
          <i class="fas fa-arrow-left mr-2"></i>Back to Home
        </button>
      </div>

      <!-- REGISTER FORM -->
      <div id="auth-register" style="display:none">
        <h2 class="text-xl font-extrabold serif mb-1">Create your account</h2>
        <p class="text-sm mb-6" style="color:var(--muted)">Start splitting expenses in seconds</p>
        <div class="space-y-4">
          <div>
            <label>Full Name</label>
            <input class="input" id="reg-name" placeholder="Your full name" onkeydown="if(event.key==='Enter')doRegister()"/>
            <div id="reg-name-err" class="error-msg" style="display:none"></div>
          </div>
          <div>
            <label>Email</label>
            <input class="input" id="reg-email" type="email" placeholder="you@email.com" onkeydown="if(event.key==='Enter')doRegister()"/>
            <div id="reg-email-err" class="error-msg" style="display:none"></div>
          </div>
          <div>
            <label>Phone (optional)</label>
            <input class="input" id="reg-phone" type="tel" placeholder="+91 ..."/>
          </div>
          <div>
            <label>Password</label>
            <input class="input" id="reg-password" type="password" placeholder="Min. 6 characters" onkeydown="if(event.key==='Enter')doRegister()"/>
            <div id="reg-password-err" class="error-msg" style="display:none"></div>
          </div>
          <div>
            <label>Confirm Password</label>
            <input class="input" id="reg-confirm" type="password" placeholder="Repeat password" onkeydown="if(event.key==='Enter')doRegister()"/>
            <div id="reg-confirm-err" class="error-msg" style="display:none"></div>
          </div>
          <div id="reg-general-err" class="error-msg" style="display:none"></div>
          <button class="btn-primary w-full mt-2" onclick="doRegister()">
            <i class="fas fa-user-plus mr-2"></i>Create Account
          </button>
        </div>
        <p class="text-center text-sm mt-5" style="color:var(--muted)">
          Already have an account?
          <span class="font-bold cursor-pointer" style="color:var(--accent)" onclick="switchAuthTab('login')">Sign in →</span>
        </p>
        <button class="btn-ghost w-full mt-3" style="font-size:13px" onclick="showPage('landing')">
          <i class="fas fa-arrow-left mr-2"></i>Back to Home
        </button>
      </div>
    </div>
  </div>
`;
