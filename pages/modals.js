/**
 * pages/modals.js
 * Injects all modal overlays into #modals-root.
 */
document.getElementById('modals-root').innerHTML = `

  <!-- ===== ADD EXPENSE ===== -->
  <div class="modal-overlay" id="addExpenseModal">
    <div class="modal">
      <div class="flex items-center justify-between mb-5">
        <h2 class="font-extrabold text-lg serif">Add Expense</h2>
        <button onclick="closeModal('addExpenseModal')" class="close-btn">✕</button>
      </div>
      <div class="space-y-4">
        <div><label>Description *</label><input class="input" id="exp-desc" placeholder="e.g. Dinner at restaurant"/></div>
        <div class="grid grid-cols-2 gap-3">
          <div><label>Amount (₹) *</label><input class="input" id="exp-amount" type="number" placeholder="0.00"/></div>
          <div><label>Category</label>
            <select class="input" id="exp-cat">
              <option value="food">🍔 Food</option>
              <option value="travel">✈️ Travel</option>
              <option value="rent">🏠 Rent</option>
              <option value="entertainment">🎬 Entertainment</option>
              <option value="utilities">💡 Utilities</option>
              <option value="other">📦 Other</option>
            </select>
          </div>
        </div>
        <div><label>Paid by</label><select class="input" id="exp-paidby"></select></div>
        <div><label>Split with</label><div id="split-checkboxes" class="space-y-2 mt-1 max-h-32 overflow-y-auto pr-1"></div></div>
        <div>
          <label>Split type</label>
          <div class="flex gap-2 mt-1">
            <span class="tab active" onclick="setSplitType('equal',this)">Equal</span>
            <span class="tab"        onclick="setSplitType('percentage',this)">%</span>
            <span class="tab"        onclick="setSplitType('exact',this)">Exact</span>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div><label>Date</label><input class="input" id="exp-date" type="date"/></div>
          <div><label>Group (optional)</label><select class="input" id="exp-group"></select></div>
        </div>
        <div class="flex gap-3 pt-2">
          <button class="btn-ghost flex-1" onclick="closeModal('addExpenseModal')">Cancel</button>
          <button class="btn-primary flex-1" onclick="addExpense()">Add Expense</button>
        </div>
      </div>
    </div>
  </div>

  <!-- ===== ADD FRIEND ===== -->
  <div class="modal-overlay" id="addFriendModal">
    <div class="modal">
      <div class="flex items-center justify-between mb-5">
        <h2 class="font-extrabold text-lg serif">Add Friend</h2>
        <button onclick="closeModal('addFriendModal')" class="close-btn">✕</button>
      </div>
      <div class="space-y-4">
        <div><label>Name *</label><input class="input" id="friend-name"  placeholder="Friend's name"/></div>
        <div><label>Email *</label><input class="input" id="friend-email" type="email" placeholder="friend@email.com"/></div>
        <div><label>Phone (optional)</label><input class="input" id="friend-phone" type="tel" placeholder="+91 ..."/></div>
        <div class="flex gap-3 pt-2">
          <button class="btn-ghost flex-1" onclick="closeModal('addFriendModal')">Cancel</button>
          <button class="btn-primary flex-1" onclick="addFriend()">Add Friend</button>
        </div>
      </div>
    </div>
  </div>

  <!-- ===== ADD GROUP ===== -->
  <div class="modal-overlay" id="addGroupModal">
    <div class="modal">
      <div class="flex items-center justify-between mb-5">
        <h2 class="font-extrabold text-lg serif">New Group</h2>
        <button onclick="closeModal('addGroupModal')" class="close-btn">✕</button>
      </div>
      <div class="space-y-4">
        <div><label>Group Name *</label><input class="input" id="group-name" placeholder="e.g. Goa Trip 2025"/></div>
        <div><label>Type</label>
          <select class="input" id="group-type">
            <option value="trip">✈️ Trip</option>
            <option value="home">🏠 Home</option>
            <option value="work">💼 Work</option>
            <option value="other">📦 Other</option>
          </select>
        </div>
        <div><label>Add Members</label><div id="group-member-checkboxes" class="space-y-2 mt-1 max-h-40 overflow-y-auto pr-1"></div></div>
        <div class="flex gap-3 pt-2">
          <button class="btn-ghost flex-1" onclick="closeModal('addGroupModal')">Cancel</button>
          <button class="btn-primary flex-1" onclick="addGroup()">Create Group</button>
        </div>
      </div>
    </div>
  </div>

  <!-- ===== ADD MEMBER TO GROUP ===== -->
  <div class="modal-overlay" id="addMemberModal">
    <div class="modal">
      <div class="flex items-center justify-between mb-5">
        <h2 class="font-extrabold text-lg serif">Add Members to Group</h2>
        <button onclick="closeModal('addMemberModal')" class="close-btn">✕</button>
      </div>
      <div class="space-y-4">
        <div class="p-3 rounded-xl" style="background:rgba(129,140,248,0.08);border:1px solid rgba(129,140,248,0.2)">
          <div class="text-xs font-bold uppercase tracking-widest mb-1" style="color:var(--accent2)">Group</div>
          <div class="font-bold" id="add-member-group-name">—</div>
        </div>
        <div><label>Current Members</label><div id="current-members-display" class="flex flex-wrap gap-2 mt-1 min-h-8"></div></div>
        <div><label>Select New Members to Add</label><div id="add-member-checkboxes" class="space-y-2 mt-1 max-h-48 overflow-y-auto pr-1"></div></div>
        <div class="flex gap-3 pt-2">
          <button class="btn-ghost flex-1" onclick="closeModal('addMemberModal')">Cancel</button>
          <button class="btn-primary flex-1" onclick="confirmAddMembers()"><i class="fas fa-user-plus mr-1"></i>Add Members</button>
        </div>
      </div>
    </div>
  </div>

  <!-- ===== ADD REMINDER ===== -->
  <div class="modal-overlay" id="addReminderModal">
    <div class="modal">
      <div class="flex items-center justify-between mb-5">
        <h2 class="font-extrabold text-lg serif">Add Reminder</h2>
        <button onclick="closeModal('addReminderModal')" class="close-btn">✕</button>
      </div>
      <div class="space-y-4">
        <div><label>Remind Friend *</label><select class="input" id="reminder-friend"></select></div>
        <div><label>Amount (₹)</label><input class="input" id="reminder-amount" type="number" placeholder="0"/></div>
        <div><label>Message</label><textarea class="input" id="reminder-msg" rows="3" placeholder="Hey! Can you settle up?"></textarea></div>
        <div><label>Due Date</label><input class="input" id="reminder-due" type="date"/></div>
        <div class="flex gap-3 pt-2">
          <button class="btn-ghost flex-1" onclick="closeModal('addReminderModal')">Cancel</button>
          <button class="btn-primary flex-1" onclick="addReminder()">Set Reminder</button>
        </div>
      </div>
    </div>
  </div>

  <!-- ===== SETTLE UP ===== -->
  <div class="modal-overlay" id="settleModal">
    <div class="modal">
      <div class="flex items-center justify-between mb-5">
        <h2 class="font-extrabold text-lg serif">Settle Up</h2>
        <button onclick="closeModal('settleModal')" class="close-btn">✕</button>
      </div>
      <div class="space-y-4">
        <div class="p-4 rounded-xl text-center" style="background:rgba(110,231,183,0.08)">
          <div class="text-sm mb-1" style="color:var(--muted)">Settling with</div>
          <div class="font-extrabold text-xl" id="settle-friend-name">Friend</div>
          <div class="text-3xl font-extrabold mt-2" style="color:var(--accent)" id="settle-amount">₹0</div>
        </div>
        <div><label>Payment Method</label>
          <select class="input">
            <option>💳 UPI</option>
            <option>🏦 Bank Transfer</option>
            <option>💵 Cash</option>
          </select>
        </div>
        <div><label>Note (optional)</label><input class="input" id="settle-note" placeholder="Settlement note..."/></div>
        <div class="flex gap-3 pt-2">
          <button class="btn-ghost flex-1" onclick="closeModal('settleModal')">Cancel</button>
          <button class="btn-primary flex-1" onclick="settleUp()">Confirm Settlement</button>
        </div>
      </div>
    </div>
  </div>

  <!-- ===== QUICK BUDGET ===== -->
  <div class="modal-overlay" id="budgetModal">
    <div class="modal">
      <div class="flex items-center justify-between mb-5">
        <h2 class="font-extrabold text-lg serif">Set Monthly Budget</h2>
        <button onclick="closeModal('budgetModal')" class="close-btn">✕</button>
      </div>
      <div class="space-y-4">
        <div class="p-3 rounded-xl text-sm" style="background:rgba(110,231,183,0.08);border:1px solid rgba(110,231,183,0.2);color:var(--muted)">
          You'll get a warning when you reach 80% of your budget, and an alert when you exceed it.
        </div>
        <div><label>Total Monthly Limit (₹)</label><input class="input" type="number" id="quick-limit" placeholder="e.g. 20000"/></div>
        <div class="grid grid-cols-2 gap-3 mt-3">
          <div class="p-3 rounded-xl text-center cursor-pointer" style="border:1px solid var(--border);background:var(--surface2)" onclick="setQuickPreset(10000)"><div class="font-bold">₹10,000</div><div class="text-xs" style="color:var(--muted)">Basic</div></div>
          <div class="p-3 rounded-xl text-center cursor-pointer" style="border:1px solid var(--border);background:var(--surface2)" onclick="setQuickPreset(20000)"><div class="font-bold">₹20,000</div><div class="text-xs" style="color:var(--muted)">Moderate</div></div>
          <div class="p-3 rounded-xl text-center cursor-pointer" style="border:1px solid var(--border);background:var(--surface2)" onclick="setQuickPreset(35000)"><div class="font-bold">₹35,000</div><div class="text-xs" style="color:var(--muted)">Comfortable</div></div>
          <div class="p-3 rounded-xl text-center cursor-pointer" style="border:1px solid var(--border);background:var(--surface2)" onclick="setQuickPreset(50000)"><div class="font-bold">₹50,000</div><div class="text-xs" style="color:var(--muted)">High</div></div>
        </div>
        <div class="flex gap-3 pt-2">
          <button class="btn-ghost flex-1" onclick="closeModal('budgetModal')">Cancel</button>
          <button class="btn-primary flex-1" onclick="setQuickBudget()">Set Budget</button>
        </div>
      </div>
    </div>
  </div>

  <!-- ===== CONFIRM DELETE ===== -->
  <div class="modal-overlay" id="confirmDeleteModal">
    <div class="modal" style="max-width:380px">
      <div class="flex items-center justify-between mb-5">
        <h2 class="font-extrabold text-lg serif" style="color:var(--danger)">Delete All Data?</h2>
        <button onclick="closeModal('confirmDeleteModal')" class="close-btn">✕</button>
      </div>
      <p class="text-sm mb-5" style="color:var(--muted)">
        This will permanently delete all your expenses, friends, groups, and reminders. This action cannot be undone.
      </p>
      <div class="flex gap-3">
        <button class="btn-ghost flex-1" onclick="closeModal('confirmDeleteModal')">Cancel</button>
        <button class="btn-danger flex-1" onclick="deleteAllData()"><i class="fas fa-trash mr-2"></i>Yes, Delete Everything</button>
      </div>
    </div>
  </div>
`;
