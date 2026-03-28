/**
 * render.js
 * All DOM-rendering functions for every app section.
 * Depends on: helpers.js, state.js
 */

/* ============================================================
   ORCHESTRATOR
   ============================================================ */

/** Re-renders all visible sections */
function renderAll() {
  renderDashboardStats();
  renderExpenses();
  renderFriends();
  renderGroups();
  renderReminders();
  renderSettingsLimits();
}

/* ============================================================
   DASHBOARD
   ============================================================ */

function renderDashboardStats() {
  const owed  = state.friends.filter(f => f.balance > 0).reduce((s, f) => s + f.balance, 0);
  const owe   = state.friends.filter(f => f.balance < 0).reduce((s, f) => s + Math.abs(f.balance), 0);
  const spent = monthlySpent();
  const limit = state.budget.total || 0;

  const so = ge('stat-owed');  if (so) so.textContent = formatINR(owed);
  const sw = ge('stat-owe');   if (sw) sw.textContent = formatINR(owe);
  const ss = ge('stat-spent'); if (ss) ss.textContent = formatINR(spent);
  const st = ge('stat-total'); if (st) st.textContent = state.expenses.length;
  const bw = ge('budget-warn');
  if (bw) bw.style.display = limit > 0 && spent > limit ? 'block' : 'none';

  _renderInsightPills(spent, limit);
  _renderRecentExpenses();
  _renderBalanceList();
}

function _renderInsightPills(spent, limit) {
  const pills = ge('dash-insights');
  if (!pills) return;
  const cs     = catSpent();
  const topCat = Object.entries(cs).sort((a, b) => b[1] - a[1])[0];
  const pct    = limit > 0 ? Math.round(spent / limit * 100) : 0;
  const data   = [
    { icon: '📈', text: `Highest spend: ${topCat ? catMap[topCat[0]]?.label + ' ' + formatINR(topCat[1]) : 'N/A'}` },
    { icon: '👥', text: `${state.friends.filter(f => f.balance > 0).length} friends owe you` },
    { icon: '📅', text: `${state.expenses.filter(e => e.paidBy === 'me').length} expenses logged` },
  ];
  if (limit > 0) data.push({ icon: pct >= 80 ? '⚠️' : '✅', text: `Budget ${pct}% used` });
  pills.innerHTML = data.map(d =>
    `<div class="insight-pill"><span>${d.icon}</span><span class="text-xs font-semibold">${d.text}</span></div>`
  ).join('');
}

function _renderRecentExpenses() {
  const list = ge('recent-expenses-list');
  if (!list) return;
  const recent = [...state.expenses].sort((a, b) => b.id - a.id).slice(0, 5);
  list.innerHTML = recent.length
    ? recent.map(expenseRowHTML).join('')
    : '<div class="text-center py-6" style="color:var(--muted)">No expenses yet</div>';
}

function _renderBalanceList() {
  const bl = ge('balance-list');
  if (!bl) return;
  const fs = state.friends.filter(f => f.balance !== 0);
  bl.innerHTML = fs.length ? fs.map(f => `
    <div class="flex items-center gap-3 mb-3">${avatarEl(f)}
      <div class="flex-1 min-w-0">
        <div class="font-semibold text-sm truncate">${f.name}</div>
        <div class="text-xs ${f.balance > 0 ? 'text-green-400' : 'text-red-400'}">
          ${f.balance > 0 ? 'owes you' : 'you owe'} ${formatINR(Math.abs(f.balance))}
        </div>
      </div>
      ${f.balance > 0
        ? `<button class="btn-primary" style="padding:5px 12px;font-size:12px" onclick="openSettleModal(${f.id})">Settle</button>`
        : ''}
    </div>`).join('')
    : '<div class="text-sm" style="color:var(--muted)">All settled up! 🎉</div>';
}

/* ============================================================
   SHARED EXPENSE ROW HTML
   ============================================================ */

/**
 * Returns the HTML string for a single expense row.
 * @param {object} e - expense object
 */
function expenseRowHTML(e) {
  const cat = catMap[e.category] || catMap.other;
  return `
    <div class="expense-row">
      <div class="cat-icon" style="background:${cat.color}"><span>${cat.icon}</span></div>
      <div class="flex-1 min-w-0">
        <div class="font-semibold text-sm truncate">${e.desc}</div>
        <div class="text-xs mt-1" style="color:var(--muted)">
          ${dateStr(e.date)} · ${e.paidBy === 'me' ? 'You paid' : e.paidBy + ' paid'}
        </div>
      </div>
      <div class="text-right flex-shrink-0">
        <div class="font-extrabold" style="color:${e.paidBy === 'me' ? 'var(--accent)' : 'var(--muted)'}">
          ${formatINR(e.amount)}
        </div>
        <span class="badge badge-${e.paidBy === 'me' ? 'green' : 'orange'}" style="font-size:10px">
          ${e.paidBy === 'me' ? 'you paid' : 'they paid'}
        </span>
      </div>
      <button class="btn-danger" style="padding:5px 9px;font-size:12px" onclick="deleteExpense(${e.id})">
        <i class="fas fa-trash-alt"></i>
      </button>
    </div>`;
}

/* ============================================================
   EXPENSES SECTION
   ============================================================ */

function renderExpenses() {
  let exps = [...state.expenses];
  if (expenseFilter !== 'all') exps = exps.filter(e => e.category === expenseFilter);
  if (expenseSearch) exps = exps.filter(e => e.desc.toLowerCase().includes(expenseSearch.toLowerCase()));
  exps.sort((a, b) => b.id - a.id);
  const list = ge('all-expenses-list');
  if (list) list.innerHTML = exps.length
    ? exps.map(expenseRowHTML).join('')
    : '<div class="text-center py-10" style="color:var(--muted)"><i class="fas fa-receipt text-3xl mb-3"></i><br>No expenses found</div>';
}

function filterExpenses(cat, el) {
  expenseFilter = cat;
  document.querySelectorAll('#sec-expenses .tab').forEach(t => t.classList.remove('active'));
  if (el) el.classList.add('active');
  renderExpenses();
}

function searchExpenses(val) {
  expenseSearch = val;
  renderExpenses();
}

/* ============================================================
   FRIENDS SECTION
   ============================================================ */

function renderFriends(search = '') {
  let friends = [...state.friends];
  if (search) friends = friends.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.email.toLowerCase().includes(search.toLowerCase())
  );
  const list = ge('friends-list');
  if (!list) return;
  list.innerHTML = friends.length ? friends.map(f => `
    <div class="friend-card">
      ${avatarEl(f)}
      <div class="flex-1 min-w-0">
        <div class="font-semibold text-sm">${f.name}</div>
        <div class="text-xs" style="color:var(--muted)">${f.email}${f.phone ? ' · ' + f.phone : ''}</div>
        <div class="text-xs mt-1 ${f.balance > 0 ? 'text-green-400' : f.balance < 0 ? 'text-red-400' : ''}">
          ${f.balance > 0 ? 'owes you ' + formatINR(f.balance)
            : f.balance < 0 ? 'you owe ' + formatINR(Math.abs(f.balance))
            : 'settled'}
        </div>
      </div>
      <div class="flex gap-2">
        ${f.balance > 0
          ? `<button class="btn-primary" style="padding:5px 12px;font-size:12px" onclick="openSettleModal(${f.id})">Settle</button>`
          : ''}
        <button class="btn-ghost"   style="padding:5px 10px;font-size:12px" onclick="openReminderForFriend(${f.id})"><i class="fas fa-bell"></i></button>
        <button class="btn-danger"  style="padding:5px 9px;font-size:12px"  onclick="removeFriend(${f.id})"><i class="fas fa-user-minus"></i></button>
      </div>
    </div>`).join('')
    : '<div class="text-center py-10" style="color:var(--muted)"><i class="fas fa-user-friends text-3xl mb-3"></i><br>No friends added yet</div>';
}

/* ============================================================
   GROUPS SECTION
   ============================================================ */

function renderGroups() {
  const list = ge('groups-list');
  if (!list) return;
  const groupTypeIcons = { trip: '✈️', home: '🏠', work: '💼', other: '📦' };
  list.innerHTML = state.groups.length ? state.groups.map(g => {
    const memberNames   = g.members.map(mid => { const f = getFriend(mid); return f ? f.name.split(' ')[0] : ''; }).filter(Boolean);
    const groupExpenses = state.expenses.filter(e => e.group == g.id);
    const total         = groupExpenses.reduce((s, e) => s + e.amount, 0);
    return `
      <div class="group-card">
        <div class="flex items-start justify-between mb-3">
          <div>
            <div class="font-extrabold">${groupTypeIcons[g.type] || '📦'} ${g.name}</div>
            <div class="text-xs mt-1" style="color:var(--muted)">${g.members.length} members · ${formatINR(total)} total</div>
          </div>
          <button class="btn-danger" style="padding:4px 8px;font-size:11px" onclick="removeGroup(${g.id})">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
        <div class="flex flex-wrap gap-1 mb-3">
          ${memberNames.slice(0, 5).map(n => `<span class="member-chip">${n}</span>`).join('')}
          ${memberNames.length > 5 ? `<span class="member-chip">+${memberNames.length - 5}</span>` : ''}
        </div>
        <button class="btn-ghost w-full" style="font-size:12px;padding:6px" onclick="openAddMemberModal(${g.id})">
          <i class="fas fa-user-plus mr-1"></i>Add Members
        </button>
      </div>`;
  }).join('')
    : '<div class="col-span-3 text-center py-10" style="color:var(--muted)"><i class="fas fa-layer-group text-3xl mb-3"></i><br>No groups yet</div>';
}

/* ============================================================
   REMINDERS SECTION
   ============================================================ */

function renderReminders() {
  const list = ge('reminders-list');
  if (!list) return;
  list.innerHTML = state.reminders.length ? state.reminders.map(r => {
    const f = getFriend(r.friendId);
    if (!f) return '';
    return `
      <div class="card mb-3">
        <div class="flex items-start gap-4">
          ${avatarEl(f)}
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="font-semibold text-sm">${f.name}</span>
              ${r.amount ? `<span class="badge badge-orange">${formatINR(r.amount)}</span>` : ''}
              ${r.sent
                ? '<span class="badge badge-green">Sent</span>'
                : '<span class="badge badge-purple">Pending</span>'}
            </div>
            <div class="text-xs mt-1" style="color:var(--muted)">${r.msg}</div>
            <div class="text-xs mt-1" style="color:var(--muted)">Due: ${dateStr(r.due)}</div>
          </div>
          <div class="flex gap-2">
            ${!r.sent
              ? `<button class="btn-primary" style="padding:5px 10px;font-size:12px" onclick="sendReminder(${r.id})"><i class="fas fa-paper-plane"></i></button>`
              : ''}
            <button class="btn-danger" style="padding:5px 9px;font-size:12px" onclick="deleteReminder(${r.id})"><i class="fas fa-trash-alt"></i></button>
          </div>
        </div>
      </div>`;
  }).join('')
    : '<div class="card text-center py-10" style="color:var(--muted)"><i class="fas fa-bell-slash text-3xl mb-3"></i><br>No reminders set</div>';

  const pending = state.reminders.filter(r => !r.sent).length;
  const badge   = ge('reminder-badge');
  if (badge) badge.style.display = pending > 0 ? 'inline-block' : 'none';
}

/* ============================================================
   SETTINGS SECTION
   ============================================================ */

function renderSettingsLimits() {
  const tl = ge('setting-total-limit');
  if (tl) tl.value = state.budget.total || '';

  const catInputs = ge('cat-limit-inputs');
  if (catInputs) {
    catInputs.innerHTML = Object.entries(catMap).map(([key, c]) => `
      <div class="grid grid-cols-2 gap-2 items-center">
        <label style="margin:0;color:var(--text)">${c.icon} ${c.label}</label>
        <input class="input" style="padding:7px 10px" type="number" placeholder="No limit"
          value="${state.budget.categories[key] || ''}"
          oninput="state.budget.categories['${key}']=parseInt(this.value)||0"/>
      </div>`).join('');
  }
}

/* ============================================================
   MODAL DATA REFRESH
   ============================================================ */

/** Populates all modal dropdowns/checkboxes from current state */
function refreshModalData() {
  const user   = Auth.currentUser();
  const myName = user ? user.name : 'You';

  // Paid-by dropdown
  const pb = ge('exp-paidby');
  if (pb) pb.innerHTML =
    `<option value="me">You (${myName})</option>` +
    state.friends.map(f => `<option value="${f.name}">${f.name}</option>`).join('');

  // Split-with checkboxes
  const sc = ge('split-checkboxes');
  if (sc) sc.innerHTML = state.friends.length
    ? state.friends.map(f => `
        <label class="flex items-center gap-2 cursor-pointer text-sm">
          <input type="checkbox" value="${f.id}" class="w-4 h-4 accent-green-400"/>${f.name}
        </label>`).join('')
    : '<div class="text-xs" style="color:var(--muted)">Add friends first to split with them</div>';

  // Group dropdown
  const eg = ge('exp-group');
  if (eg) eg.innerHTML =
    `<option value="">No group</option>` +
    state.groups.map(g => `<option value="${g.id}">${g.name}</option>`).join('');

  // Expense date
  const ed = ge('exp-date'); if (ed) ed.value = today();

  // Group member checkboxes
  const gmc = ge('group-member-checkboxes');
  if (gmc) gmc.innerHTML = state.friends.length
    ? state.friends.map(f => `
        <label class="flex items-center gap-2 cursor-pointer text-sm">
          <input type="checkbox" value="${f.id}" class="w-4 h-4 accent-green-400"/>${f.name}
        </label>`).join('')
    : '<div class="text-xs" style="color:var(--muted)">Add friends first</div>';

  // Reminder friend dropdown
  const rf = ge('reminder-friend');
  if (rf) rf.innerHTML = state.friends.length
    ? state.friends.map(f => `<option value="${f.id}">${f.name}</option>`).join('')
    : '<option value="">No friends added</option>';

  const rd = ge('reminder-due'); if (rd) rd.value = today();
  const ql = ge('quick-limit'); if (ql && state.budget.total) ql.value = state.budget.total;
}
