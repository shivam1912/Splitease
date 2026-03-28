/**
 * actions.js
 * All user-triggered CRUD operations.
 * Depends on: helpers.js, state.js, render.js, ui.js, charts.dashboard.js
 */

/* ============================================================
   EXPENSES
   ============================================================ */

function addExpense() {
  const desc   = ge('exp-desc').value.trim();
  const amount = parseFloat(ge('exp-amount').value);
  const cat    = ge('exp-cat').value;
  const paidBy = ge('exp-paidby').value;
  const date   = ge('exp-date').value || today();
  const group  = ge('exp-group').value;

  if (!desc || !amount || amount <= 0) { showToast('⚠️ Fill required fields', '⚠️'); return; }

  const splitWith = Array.from(document.querySelectorAll('#split-checkboxes input:checked'))
    .map(c => parseInt(c.value));

  state.expenses.push({ id: Helpers.nextId(), desc, amount, category: cat, paidBy, date, splitWith, group });

  // Auto-update friend balances
  if (paidBy === 'me' && splitWith.length > 0) {
    const share = amount / (splitWith.length + 1);
    splitWith.forEach(fid => { const f = getFriend(fid); if (f) f.balance += share; });
  } else if (paidBy !== 'me') {
    const payerFriend = state.friends.find(f => f.name === paidBy);
    if (payerFriend) payerFriend.balance -= amount / (splitWith.length + 1);
  }

  ge('exp-desc').value  = '';
  ge('exp-amount').value = '';
  closeModal('addExpenseModal');
  showToast('✅ Expense added!');
  AppData.save();
  renderAll();
  checkBudgetWarning();
  setTimeout(renderDashboardCharts, 100);
}

function deleteExpense(id) {
  state.expenses = state.expenses.filter(e => e.id !== id);
  showToast('🗑️ Deleted', '🗑️');
  AppData.save();
  renderAll();
  setTimeout(renderDashboardCharts, 100);
}

function checkBudgetWarning() {
  const spent = monthlySpent();
  const limit = state.budget.total || 0;
  if (limit > 0 && spent >= limit)         showToast('🚨 Monthly budget exceeded!', '🚨');
  else if (limit > 0 && spent >= limit * 0.8) showToast('⚠️ 80%+ of budget used!', '⚠️');
}

function setSplitType(type, el) {
  state.splitType = type;
  document.querySelectorAll('#addExpenseModal .tab').forEach(t => t.classList.remove('active'));
  if (el) el.classList.add('active');
}

/* ============================================================
   FRIENDS
   ============================================================ */

function addFriend() {
  const name  = ge('friend-name').value.trim();
  const email = ge('friend-email').value.trim();
  const phone = ge('friend-phone').value.trim();

  if (!name || !email) { showToast('⚠️ Name & email required', '⚠️'); return; }
  if (state.friends.find(f => f.email.toLowerCase() === email.toLowerCase())) {
    showToast('⚠️ Friend already added', '⚠️'); return;
  }

  state.friends.push({
    id: Helpers.nextId(),
    name,
    email,
    phone,
    balance: 0,
    initials: getInitials(name),
    color: state.friends.length % avatarBgs.length,
  });

  ['friend-name', 'friend-email', 'friend-phone'].forEach(id => ge(id).value = '');
  closeModal('addFriendModal');
  showToast('✅ Friend added!');
  AppData.save();
  renderAll();
}

function removeFriend(id) {
  state.friends = state.friends.filter(f => f.id !== id);
  // Clean up all references
  state.expenses.forEach(e => { e.splitWith = e.splitWith.filter(fid => fid !== id); });
  state.groups.forEach(g => { g.members = g.members.filter(mid => mid !== id); });
  state.reminders = state.reminders.filter(r => r.friendId !== id);
  showToast('👋 Removed', '👋');
  AppData.save();
  renderAll();
}

/* ============================================================
   GROUPS
   ============================================================ */

function addGroup() {
  const name = ge('group-name').value.trim();
  const type = ge('group-type').value;
  if (!name) { showToast('⚠️ Group name required', '⚠️'); return; }

  const members = Array.from(document.querySelectorAll('#group-member-checkboxes input:checked'))
    .map(c => parseInt(c.value));

  state.groups.push({ id: Helpers.nextId(), name, type, members });
  ge('group-name').value = '';
  closeModal('addGroupModal');
  showToast('✅ Group created!');
  AppData.save();
  renderAll();
}

function removeGroup(id) {
  state.groups = state.groups.filter(g => g.id !== id);
  showToast('🗑️ Deleted', '🗑️');
  AppData.save();
  renderAll();
}

function openAddMemberModal(groupId) {
  const g = state.groups.find(g => g.id === groupId); if (!g) return;
  state.addMemberTargetGroup = groupId;
  ge('add-member-group-name').textContent = g.name;
  ge('current-members-display').innerHTML = g.members.map(mid => {
    const f = getFriend(mid);
    return f ? `<span class="member-chip">${avatarEl(f, 18)} ${f.name.split(' ')[0]}</span>` : '';
  }).join('');

  const nonMembers = state.friends.filter(f => !g.members.includes(f.id));
  ge('add-member-checkboxes').innerHTML = nonMembers.length
    ? nonMembers.map(f => `
        <label class="flex items-center gap-3 cursor-pointer p-2 rounded-lg"
          style="transition:0.15s"
          onmouseover="this.style.background='var(--surface2)'"
          onmouseout="this.style.background=''">
          <input type="checkbox" value="${f.id}" class="w-4 h-4 accent-green-400"/>
          ${avatarEl(f, 28)}
          <div>
            <div class="text-sm font-semibold">${f.name}</div>
            <div class="text-xs" style="color:var(--muted)">${f.email}</div>
          </div>
        </label>`).join('')
    : '<div class="text-sm py-2" style="color:var(--muted)">All friends already in group!</div>';

  ge('addMemberModal').classList.add('open');
}

function confirmAddMembers() {
  const g = state.groups.find(g => g.id === state.addMemberTargetGroup); if (!g) return;
  const newIds = Array.from(document.querySelectorAll('#add-member-checkboxes input:checked'))
    .map(c => parseInt(c.value));
  if (!newIds.length) { showToast('⚠️ Select at least one member', '⚠️'); return; }
  g.members = [...new Set([...g.members, ...newIds])];
  closeModal('addMemberModal');
  showToast(`✅ ${newIds.length} member${newIds.length > 1 ? 's' : ''} added!`);
  AppData.save();
  renderAll();
}

/* ============================================================
   REMINDERS
   ============================================================ */

function addReminder() {
  const friendId = parseInt(ge('reminder-friend').value);
  if (!friendId) { showToast('⚠️ Select a friend', '⚠️'); return; }
  const amount = parseFloat(ge('reminder-amount').value) || 0;
  const msg    = ge('reminder-msg').value.trim() || 'Please settle up!';
  const due    = ge('reminder-due').value || today();
  state.reminders.push({ id: Helpers.nextId(), friendId, amount, msg, due, sent: false });
  closeModal('addReminderModal');
  showToast('🔔 Reminder set!', '🔔');
  AppData.save();
  renderAll();
}

function deleteReminder(id) {
  state.reminders = state.reminders.filter(r => r.id !== id);
  showToast('🗑️ Deleted', '🗑️');
  AppData.save();
  renderAll();
}

function sendReminder(id) {
  const r = state.reminders.find(r => r.id === id);
  if (r) { r.sent = true; showToast('📨 Sent!', '📨'); AppData.save(); renderAll(); }
}

function openReminderForFriend(id) {
  openModal('addReminderModal');
  setTimeout(() => { const s = ge('reminder-friend'); if (s) s.value = id; }, 100);
}

/* ============================================================
   SETTLE UP
   ============================================================ */

function openSettleModal(fid) {
  const f = getFriend(fid); if (!f) return;
  settleTarget = fid;
  ge('settle-friend-name').textContent = f.name;
  ge('settle-amount').textContent      = formatINR(Math.abs(f.balance));
  openModal('settleModal');
}

function settleUp() {
  const f = getFriend(settleTarget);
  if (f) f.balance = 0;
  settleTarget = null;
  closeModal('settleModal');
  showToast('🎉 Settled!', '🎉');
  AppData.save();
  renderAll();
  setTimeout(renderDashboardCharts, 100);
}

/* ============================================================
   BUDGET
   ============================================================ */

function saveBudgetLimits() {
  state.budget.total = parseInt(ge('setting-total-limit').value) || 0;
  showToast('✅ Budget saved!');
  AppData.save();
  renderAll();
  checkBudgetWarning();
  setTimeout(renderDashboardCharts, 100);
}

function setQuickPreset(val) { ge('quick-limit').value = val; }

function setQuickBudget() {
  const v = parseInt(ge('quick-limit').value) || 0;
  state.budget.total = v;
  const el = ge('setting-total-limit'); if (el) el.value = v;
  closeModal('budgetModal');
  showToast('✅ Budget set to ' + formatINR(v));
  AppData.save();
  renderAll();
  setTimeout(renderDashboardCharts, 100);
}

/* ============================================================
   PROFILE & SETTINGS
   ============================================================ */

function saveProfile() {
  const user  = Auth.currentUser(); if (!user) return;
  const name  = ge('profile-name').value.trim();
  const email = ge('profile-email').value.trim();
  const phone = ge('profile-phone').value.trim();

  if (!name || !email) { showToast('⚠️ Name & email required', '⚠️'); return; }

  const users = Storage.getUsers();
  const idx   = users.findIndex(u => u.id === user.id);
  if (idx !== -1) {
    users[idx].name  = name;
    users[idx].email = email;
    users[idx].phone = phone;
    Storage.saveUsers(users);

    const updatedUser = { ...user, name, email, phone };
    Storage.setCurrentUser(updatedUser);
    updateSidebarUser(updatedUser);
    updateSettingsUser(updatedUser);

    // Refresh greeting
    const hour   = new Date().getHours();
    const greet  = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
    const greetEl = ge('dash-greeting');
    if (greetEl) greetEl.textContent = `${greet}, ${name.split(' ')[0]} 👋`;
  }
  showToast('✅ Profile saved!');
  AppData.save();
}

/* ============================================================
   DANGER ZONE
   ============================================================ */

function confirmDeleteAll() { openModal('confirmDeleteModal'); }

function deleteAllData() {
  const user = Auth.currentUser(); if (!user) return;
  Storage.removeUserData(user.id);
  state = AppData.createEmpty();
  closeModal('confirmDeleteModal');
  showToast('🗑️ All data deleted');
  renderAll();
  setTimeout(renderDashboardCharts, 120);
}
