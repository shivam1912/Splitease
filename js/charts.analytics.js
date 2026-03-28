/**
 * charts.analytics.js
 * All Chart.js charts rendered on the Analytics section.
 * Depends on: helpers.js, state.js, charts.dashboard.js (destroyChart, setupChartDefaults)
 */

/* ============================================================
   ORCHESTRATOR
   ============================================================ */

function renderAnalyticsCharts() {
  setupChartDefaults();
  renderBudgetDonut();
  renderCategoryBars();
  renderCatDoughnut();
  renderMonthBar();
  renderFriendBar();
  renderLineChart();
}

/* ============================================================
   BUDGET DONUT (analytics page version)
   ============================================================ */

function renderBudgetDonut() {
  destroyChart('bd');
  const ctx   = ge('budgetDonutChart'); if (!ctx) return;
  const spent = monthlySpent();
  const limit = state.budget.total || 0;
  const pct   = limit > 0 ? Math.min(Math.round(spent / limit * 100), 100) : 0;
  const color = pct >= 100 ? '#f87171' : pct >= 80 ? '#fb923c' : '#6ee7b7';

  charts['bd'] = new Chart(ctx, {
    type: 'doughnut',
    data: {
      datasets: [{
        data: [spent || 1, Math.max(limit - spent, 0)],
        backgroundColor: limit > 0 ? [color, '#2a2d3a'] : ['#2a2d3a', '#2a2d3a'],
        borderWidth: 0,
      }],
    },
    options: { cutout: '72%', plugins: { legend: { display: false }, tooltip: { enabled: false } } },
  });

  const rs = ge('ring-spent'); if (rs) rs.textContent = formatINR(spent);
  const rl = ge('ring-limit'); if (rl) rl.textContent = 'of ' + (limit > 0 ? formatINR(limit) + ' limit' : 'no limit set');
}

/* ============================================================
   CATEGORY BUDGET PROGRESS BARS
   ============================================================ */

function renderCategoryBars() {
  const container = ge('category-budget-bars'); if (!container) return;
  const cs = catSpent();
  container.innerHTML = Object.entries(catMap).map(([key, c]) => {
    const spent = cs[key] || 0;
    const limit = state.budget.categories[key] || 0;
    const pct   = limit > 0 ? Math.min(Math.round(spent / limit * 100), 100) : 0;
    const color = pct >= 100 ? 'var(--danger)' : pct >= 80 ? 'var(--accent3)' : 'var(--accent)';
    return `
      <div class="mb-3">
        <div class="flex items-center justify-between mb-1">
          <span class="text-sm font-semibold">${c.icon} ${c.label}</span>
          <span class="text-xs" style="color:var(--muted)">${formatINR(spent)}${limit > 0 ? ' / ' + formatINR(limit) : ''}</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width:${pct}%;background:${color}"></div>
        </div>
      </div>`;
  }).join('');
}

/* ============================================================
   CATEGORY DOUGHNUT
   ============================================================ */

function renderCatDoughnut() {
  destroyChart('cdd');
  const ctx     = ge('catDoughnut'); if (!ctx) return;
  const cs      = catSpent();
  const entries = Object.entries(cs).sort((a, b) => b[1] - a[1]);
  if (!entries.length) return;

  charts['cdd'] = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: entries.map(([k]) => catMap[k]?.label || k),
      datasets: [{
        data: entries.map(([, v]) => v),
        backgroundColor: CHART_COLORS,
        borderWidth: 2,
        borderColor: '#16181f',
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom', labels: { font: { size: 12 }, padding: 16 } },
        tooltip: { callbacks: { label: c => `${c.label}: ${formatINR(c.raw)}` } },
      },
    },
  });
}

/* ============================================================
   MONTHLY TREND BAR
   ============================================================ */

function renderMonthBar() {
  destroyChart('mb');
  const ctx    = ge('monthBar'); if (!ctx) return;
  const months = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
  const data   = [0, 0, 0, 0, 0, monthlySpent()];

  charts['mb'] = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: months,
      datasets: [{
        label: 'Spent',
        data,
        backgroundColor: months.map((_, i) => i === months.length - 1 ? '#6ee7b7' : 'rgba(129,140,248,0.5)'),
        borderRadius: 6,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: c => formatINR(c.raw) } },
      },
      scales: {
        x: { grid: { display: false } },
        y: { grid: { color: 'rgba(42,45,58,0.6)' }, ticks: { callback: v => '₹' + (v / 1000) + 'k' } },
      },
    },
  });
}

/* ============================================================
   FRIEND BALANCE BAR
   ============================================================ */

function renderFriendBar() {
  destroyChart('fb');
  const ctx     = ge('friendBar'); if (!ctx) return;
  const friends = state.friends.filter(f => f.balance !== 0);
  if (!friends.length) return;

  charts['fb'] = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: friends.map(f => f.name.split(' ')[0]),
      datasets: [{
        data: friends.map(f => f.balance),
        backgroundColor: friends.map(f => f.balance > 0 ? '#6ee7b7' : '#f87171'),
        borderRadius: 6,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: c => (c.raw > 0 ? 'Owes you ' : 'You owe ') + formatINR(Math.abs(c.raw)) } },
      },
      scales: {
        x: { grid: { display: false } },
        y: { grid: { color: 'rgba(42,45,58,0.6)' }, ticks: { callback: v => '₹' + Math.abs(v / 1000) + 'k' } },
      },
    },
  });
}

/* ============================================================
   CUMULATIVE SPEND LINE
   ============================================================ */

function renderLineChart() {
  destroyChart('lc');
  const ctx    = ge('lineChart'); if (!ctx) return;
  const sorted = [...state.expenses]
    .filter(e => e.paidBy === 'me')
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  let cum = 0;
  const labels = [];
  const data   = [];
  sorted.forEach(e => { cum += e.amount; labels.push(e.date.slice(5)); data.push(cum); });
  if (!labels.length) { labels.push('Now'); data.push(0); }

  charts['lc'] = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        data,
        borderColor: '#818cf8',
        backgroundColor: 'rgba(129,140,248,0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#818cf8',
        pointRadius: 4,
        borderWidth: 2,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: c => formatINR(c.raw) } },
      },
      scales: {
        x: { grid: { display: false } },
        y: { grid: { color: 'rgba(42,45,58,0.6)' }, ticks: { callback: v => '₹' + (v / 1000) + 'k' } },
      },
    },
  });
}
