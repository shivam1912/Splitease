/**
 * pages/app.js
 * Injects the full App shell (sidebar + all content sections) into #page-app.
 */
document.getElementById('page-app').innerHTML = `

  <!-- Hamburger (mobile) -->
  <button id="hamburger" onclick="toggleSidebar()"><i class="fas fa-bars"></i></button>
  <div id="sidebar-overlay" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:49;" onclick="toggleSidebar()"></div>

  <!-- ==================== SIDEBAR ==================== -->
  <aside class="sidebar" id="sidebar">
    <div style="padding:20px 16px 12px;">
      <!-- Logo -->
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:24px;">
        <div style="background:var(--accent);width:32px;height:32px;border-radius:9px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
          <i class="fas fa-bolt text-xs" style="color:#0e0f14"></i>
        </div>
        <span class="syne font-bold" style="color:var(--text);font-size:15px">SplitEase</span>
      </div>
      <!-- User chip -->
      <div style="background:var(--surface2);border:1px solid var(--border);border-radius:12px;padding:12px 14px;margin-bottom:16px;">
        <div style="display:flex;align-items:center;gap:10px;">
          <div class="avatar" id="sidebar-avatar" style="background:rgba(110,231,183,0.2);color:var(--accent);width:36px;height:36px;font-size:13px;">?</div>
          <div style="min-width:0;">
            <div class="font-bold text-sm truncate" id="sidebar-name">User</div>
            <div class="text-xs truncate" style="color:var(--muted)" id="sidebar-email">email</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Nav -->
    <nav style="padding:0 8px;flex:1;overflow-y:auto;">
      <div class="nav-item active" onclick="showSection('dashboard',this)"><span class="nav-icon"><i class="fas fa-home"></i></span>Dashboard</div>
      <div class="nav-item"        onclick="showSection('expenses',this)"><span class="nav-icon"><i class="fas fa-receipt"></i></span>Expenses</div>
      <div class="nav-item"        onclick="showSection('friends',this)"><span class="nav-icon"><i class="fas fa-user-friends"></i></span>Friends</div>
      <div class="nav-item"        onclick="showSection('groups',this)"><span class="nav-icon"><i class="fas fa-layer-group"></i></span>Groups</div>
      <div class="nav-item"        onclick="showSection('reminders',this)">
        <span class="nav-icon"><i class="fas fa-bell"></i></span>Reminders
        <span id="reminder-badge" style="display:none;background:var(--accent3);color:#0e0f14;border-radius:20px;font-size:10px;font-weight:800;padding:1px 6px;margin-left:auto;">!</span>
      </div>
      <div class="nav-item" onclick="showSection('analytics',this)"><span class="nav-icon"><i class="fas fa-chart-bar"></i></span>Analytics</div>
      <div class="nav-item" onclick="showSection('settings',this)"><span class="nav-icon"><i class="fas fa-cog"></i></span>Settings</div>
    </nav>

    <div style="padding:12px 16px;border-top:1px solid var(--border);">
      <button class="btn-ghost w-full" style="font-size:13px" onclick="logout()">
        <i class="fas fa-sign-out-alt mr-2"></i>Logout
      </button>
    </div>
  </aside>

  <!-- ==================== MAIN ==================== -->
  <main class="main">

    <!-- DASHBOARD -->
    <div id="sec-dashboard" class="section active">
      <div class="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 class="text-2xl font-extrabold serif" id="dash-greeting">Good morning 👋</h1>
          <p class="text-sm mt-1" style="color:var(--muted)" id="dash-date"></p>
        </div>
        <div class="flex gap-3">
          <button class="btn-ghost"   style="font-size:13px;padding:8px 14px" onclick="openModal('budgetModal')"><i class="fas fa-wallet mr-1"></i>Budget</button>
          <button class="btn-primary" onclick="openModal('addExpenseModal')"><i class="fas fa-plus mr-1"></i>Add Expense</button>
        </div>
      </div>

      <!-- Stat cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div class="stat-card green"><div class="text-xs font-bold uppercase tracking-widest mb-2" style="color:var(--muted)">You are owed</div><div class="text-2xl font-extrabold" style="color:var(--accent)" id="stat-owed">₹0</div></div>
        <div class="stat-card purple"><div class="text-xs font-bold uppercase tracking-widest mb-2" style="color:var(--muted)">You owe</div><div class="text-2xl font-extrabold" style="color:var(--accent2)" id="stat-owe">₹0</div></div>
        <div class="stat-card orange">
          <div class="text-xs font-bold uppercase tracking-widest mb-2" style="color:var(--muted)">Monthly Spent</div>
          <div class="text-2xl font-extrabold" style="color:var(--accent3)" id="stat-spent">₹0</div>
          <div id="budget-warn" class="text-xs mt-1 warn-flash" style="color:var(--danger);display:none">⚠️ Over budget!</div>
        </div>
        <div class="stat-card red"><div class="text-xs font-bold uppercase tracking-widest mb-2" style="color:var(--muted)">Total Expenses</div><div class="text-2xl font-extrabold" id="stat-total">0</div></div>
      </div>

      <!-- Charts row 1 -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <div class="dash-chart-card lg:col-span-2">
          <div class="flex items-center justify-between mb-3">
            <h3 class="font-bold text-sm" style="color:var(--muted)">Monthly Spending</h3>
            <span class="mini-stat up" id="dash-monthly-trend"></span>
          </div>
          <div style="position:relative;height:200px"><canvas id="dashMonthBar"></canvas></div>
        </div>
        <div class="dash-chart-card">
          <h3 class="font-bold text-sm mb-3" style="color:var(--muted)">By Category</h3>
          <div style="position:relative;height:130px"><canvas id="dashCatDonut"></canvas></div>
          <div id="dash-cat-legend" class="space-y-1 mt-3"></div>
        </div>
      </div>

      <!-- Charts row 2 -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <div class="dash-chart-card">
          <h3 class="font-bold text-sm mb-3" style="color:var(--muted)">Spending Trend</h3>
          <div style="position:relative;height:150px"><canvas id="dashLineChart"></canvas></div>
        </div>
        <div class="dash-chart-card">
          <h3 class="font-bold text-sm mb-3" style="color:var(--muted)">Friend Balances</h3>
          <div style="position:relative;height:150px"><canvas id="dashBalanceBar"></canvas></div>
        </div>
        <div class="dash-chart-card">
          <h3 class="font-bold text-sm mb-3" style="color:var(--muted)">Budget Ring</h3>
          <div style="position:relative;width:120px;height:120px;margin:0 auto">
            <canvas id="dashBudgetRing"></canvas>
            <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;pointer-events:none;">
              <div class="font-extrabold text-lg" id="dash-ring-pct">0%</div>
            </div>
          </div>
          <div class="text-xs text-center mt-2" style="color:var(--muted)" id="dash-budget-status">Set a budget to track</div>
        </div>
      </div>

      <!-- Insights + Recent -->
      <div id="dash-insights" class="flex flex-wrap gap-2 mb-4"></div>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div class="card"><h2 class="font-extrabold text-base mb-4">Recent Expenses</h2><div id="recent-expenses-list"></div></div>
        <div class="card"><h2 class="font-extrabold text-base mb-4">Balances</h2><div id="balance-list"></div></div>
      </div>
    </div>

    <!-- FRIENDS -->
    <div id="sec-friends" class="section">
      <div class="flex items-center justify-between mb-6">
        <div><h1 class="text-2xl font-extrabold serif">Friends</h1><p class="text-sm mt-1" style="color:var(--muted)">Manage friends & balances</p></div>
        <button class="btn-primary" onclick="openModal('addFriendModal')"><i class="fas fa-user-plus mr-2"></i>Add Friend</button>
      </div>
      <div class="mb-4"><input class="input" placeholder="🔍 Search friends..." oninput="renderFriends(this.value)"/></div>
      <div id="friends-list"></div>
    </div>

    <!-- GROUPS -->
    <div id="sec-groups" class="section">
      <div class="flex items-center justify-between mb-6">
        <div><h1 class="text-2xl font-extrabold serif">Groups</h1><p class="text-sm mt-1" style="color:var(--muted)">Shared expense groups</p></div>
        <button class="btn-primary" onclick="openModal('addGroupModal')"><i class="fas fa-plus mr-2"></i>New Group</button>
      </div>
      <div id="groups-list" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"></div>
    </div>

    <!-- EXPENSES -->
    <div id="sec-expenses" class="section">
      <div class="flex items-center justify-between mb-6">
        <div><h1 class="text-2xl font-extrabold serif">All Expenses</h1><p class="text-sm mt-1" style="color:var(--muted)">Track every transaction</p></div>
        <button class="btn-primary" onclick="openModal('addExpenseModal')"><i class="fas fa-plus mr-2"></i>Add Expense</button>
      </div>
      <div class="card mb-4 flex flex-wrap gap-3 items-center">
        <div class="flex flex-wrap gap-2">
          <span class="tab active"  onclick="filterExpenses('all',this)">All</span>
          <span class="tab"         onclick="filterExpenses('food',this)">🍔 Food</span>
          <span class="tab"         onclick="filterExpenses('travel',this)">✈️ Travel</span>
          <span class="tab"         onclick="filterExpenses('rent',this)">🏠 Rent</span>
          <span class="tab"         onclick="filterExpenses('entertainment',this)">🎬 Fun</span>
          <span class="tab"         onclick="filterExpenses('utilities',this)">💡 Utilities</span>
        </div>
        <input class="input" style="width:190px;flex-shrink:0" placeholder="Search expenses..." oninput="searchExpenses(this.value)"/>
      </div>
      <div class="card"><div id="all-expenses-list"></div></div>
    </div>

    <!-- REMINDERS -->
    <div id="sec-reminders" class="section">
      <div class="flex items-center justify-between mb-6">
        <div><h1 class="text-2xl font-extrabold serif">Reminders</h1><p class="text-sm mt-1" style="color:var(--muted)">Send nudges to friends</p></div>
        <button class="btn-primary" onclick="openModal('addReminderModal')"><i class="fas fa-plus mr-2"></i>Add Reminder</button>
      </div>
      <div id="reminders-list"></div>
    </div>

    <!-- ANALYTICS -->
    <div id="sec-analytics" class="section">
      <div class="mb-6"><h1 class="text-2xl font-extrabold serif">Analytics</h1><p class="text-sm mt-1" style="color:var(--muted)">Visual breakdown of your spending</p></div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div class="card flex flex-col items-center justify-center py-6">
          <h3 class="font-bold text-sm mb-5" style="color:var(--muted)">Monthly Budget</h3>
          <div style="position:relative;width:160px;height:160px">
            <canvas id="budgetDonutChart" width="160" height="160"></canvas>
            <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;pointer-events:none;">
              <div class="text-xl font-extrabold" id="ring-spent">₹0</div>
              <div class="text-xs" style="color:var(--muted)" id="ring-limit">of ₹0 limit</div>
            </div>
          </div>
          <button class="btn-ghost mt-4" style="font-size:12px;padding:6px 14px" onclick="openModal('budgetModal')">
            <i class="fas fa-edit mr-1"></i>Edit Budget
          </button>
        </div>
        <div class="md:col-span-2 card">
          <h3 class="font-bold text-sm mb-4" style="color:var(--muted)">Category Budgets vs Spending</h3>
          <div id="category-budget-bars"></div>
        </div>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <div class="card"><h3 class="font-bold text-sm mb-4" style="color:var(--muted)">Spending by Category</h3><div style="position:relative;height:260px"><canvas id="catDoughnut"></canvas></div></div>
        <div class="card"><h3 class="font-bold text-sm mb-4" style="color:var(--muted)">Monthly Trend</h3><div style="position:relative;height:260px"><canvas id="monthBar"></canvas></div></div>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div class="card"><h3 class="font-bold text-sm mb-4" style="color:var(--muted)">Friends Balance</h3><div style="position:relative;height:240px"><canvas id="friendBar"></canvas></div></div>
        <div class="card"><h3 class="font-bold text-sm mb-4" style="color:var(--muted)">Cumulative Spend (Line)</h3><div style="position:relative;height:240px"><canvas id="lineChart"></canvas></div></div>
      </div>
    </div>

    <!-- SETTINGS -->
    <div id="sec-settings" class="section">
      <div class="mb-6"><h1 class="text-2xl font-extrabold serif">Settings</h1><p class="text-sm mt-1" style="color:var(--muted)">Profile, budget limits & preferences</p></div>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">

        <!-- Profile -->
        <div class="card">
          <h2 class="font-bold text-base mb-4">Profile</h2>
          <div class="flex items-center gap-4 mb-5">
            <div class="avatar" style="background:rgba(110,231,183,0.2);color:var(--accent);width:56px;height:56px;font-size:20px;" id="settings-avatar">?</div>
            <div>
              <div class="font-bold" id="settings-name-display">User</div>
              <div class="text-sm" style="color:var(--muted)" id="settings-email-display">email</div>
              <span class="badge badge-green mt-1">Member</span>
            </div>
          </div>
          <div class="space-y-3">
            <div><label>Display Name</label><input class="input" id="profile-name"     placeholder="Your name"/></div>
            <div><label>Email</label>        <input class="input" id="profile-email"    type="email" placeholder="you@email.com"/></div>
            <div><label>Phone</label>        <input class="input" id="profile-phone"    type="tel"   placeholder="+91 ..."/></div>
            <div><label>Default Currency</label>
              <select class="input" id="profile-currency">
                <option value="INR">₹ INR</option>
                <option value="USD">$ USD</option>
                <option value="EUR">€ EUR</option>
              </select>
            </div>
            <button class="btn-primary w-full" onclick="saveProfile()">Save Changes</button>
          </div>
        </div>

        <!-- Budget limits -->
        <div class="card">
          <div class="flex items-center justify-between mb-4">
            <h2 class="font-bold text-base">Monthly Budget Limits</h2>
            <button class="btn-primary" style="padding:7px 14px;font-size:13px" onclick="saveBudgetLimits()"><i class="fas fa-save mr-1"></i>Save</button>
          </div>
          <div class="mb-4"><label>Total Monthly Limit (₹)</label><input class="input" type="number" id="setting-total-limit" placeholder="e.g. 20000"/></div>
          <div class="text-xs font-bold uppercase tracking-widest mb-3" style="color:var(--muted)">Per Category Limits</div>
          <div id="cat-limit-inputs" class="space-y-2"></div>
        </div>

        <!-- Notifications -->
        <div class="card">
          <h2 class="font-bold text-base mb-4">Notifications</h2>
          <div class="space-y-4">
            <div class="flex items-center justify-between"><div><div class="font-semibold text-sm">Budget alerts (80%+)</div></div><label class="toggle"><input type="checkbox" checked/><span class="toggle-slider"></span></label></div>
            <div class="flex items-center justify-between"><div><div class="font-semibold text-sm">Payment reminders</div></div><label class="toggle"><input type="checkbox" checked/><span class="toggle-slider"></span></label></div>
            <div class="flex items-center justify-between"><div><div class="font-semibold text-sm">New expense alerts</div></div><label class="toggle"><input type="checkbox" checked/><span class="toggle-slider"></span></label></div>
            <div class="flex items-center justify-between"><div><div class="font-semibold text-sm">Monthly reports</div></div><label class="toggle"><input type="checkbox" checked/><span class="toggle-slider"></span></label></div>
          </div>
        </div>

        <!-- Danger zone -->
        <div class="card">
          <h2 class="font-bold text-base mb-4" style="color:var(--danger)">Danger Zone</h2>
          <div class="space-y-3">
            <button class="btn-danger w-full" onclick="confirmDeleteAll()"><i class="fas fa-trash mr-2"></i>Delete All My Data</button>
            <button class="btn-danger w-full" onclick="logout()"><i class="fas fa-sign-out-alt mr-2"></i>Logout</button>
          </div>
        </div>

      </div>
    </div>

  </main>
`;
