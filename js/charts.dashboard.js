/**
 * charts.dashboard.js
 * All Chart.js charts rendered on the Dashboard section.
 * Depends on: helpers.js, state.js
 */

/* ============================================================
   SETUP & UTILITIES
   ============================================================ */

function setupChartDefaults() {
  Chart.defaults.color       = '#6b7280';
  Chart.defaults.font.family = "'Cabinet Grotesk', sans-serif";
}

/** Destroys a chart instance by registry key and removes it from the registry */
function destroyChart(key) {
  if (charts[key]) {
    try { charts[key].destroy(); } catch (e) { /* noop */ }
    delete charts[key];
  }
}

/* ============================================================
   ORCHESTRATOR
   ============================================================ */

function renderDashboardCharts() {
  setupChartDefaults();
  renderDashMonthBar();
  renderDashCatDonut();
  renderDashLine();
  renderDashBalanceBar();
  renderDashBudgetRing();
}

/* ============================================================
   MONTHLY SPENDING BAR
   ============================================================ */

function renderDashMonthBar() {
  destroyChart('dmb');
  const ctx = ge('dashMonthBar'); if (!ctx) return;

  const months       = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
  const currentSpent = monthlySpent();
  const data         = [0, 0, 0, 0, 0, currentSpent];
  const limit        = state.budget.total;

  const trendEl = ge('dash-monthly-trend');
  if (trendEl) {
    trendEl.className = 'mini-stat up';
    trendEl.innerHTML = `<i class="fas fa-chart-line" style="font-size:10px"></i> this month`;
  }

  charts['dmb'] = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: months,
      datasets: [
        {
          label: 'Spent',
          data,
          backgroundColor: months.map((_, i) => i === months.length - 1 ? '#6ee7b7' : 'rgba(129,140,248,0.45)'),
          borderRadius: 6,
          borderSkipped: false,
        },
        ...(limit ? [{
          label: 'Budget',
          data: months.map(() => limit),
          type: 'line',
          borderColor: 'rgba(248,113,113,0.5)',
          backgroundColor: 'transparent',
          borderDash: [5, 4],
          pointRadius: 0,
          borderWidth: 1.5,
        }] : []),
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: c => `${c.dataset.label}: ${formatINR(c.raw)}` } },
      },
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 11 } } },
        y: { grid: { color: 'rgba(42,45,58,0.8)' }, ticks: { callback: v => '₹' + (v / 1000) + 'k', font: { size: 11 } } },
      },
    },
  });
}

/* ============================================================
   CATEGORY DONUT
   ============================================================ */

function renderDashCatDonut() {
  destroyChart('dcd');
  const ctx = ge('dashCatDonut'); if (!ctx) return;

  const cs      = catSpent();
  const entries = Object.entries(cs).sort((a, b) => b[1] - a[1]);
  if (!entries.length) {
    if (ctx.parentElement) ctx.parentElement.innerHTML = '<div class="text-center py-4" style="color:var(--muted);font-size:13px">No expenses yet</div>';
    return;
  }

  const labels = entries.map(([k])    => (catMap[k] || catMap.other).label);
  const data   = entries.map(([, v])  => v);
  const colors = entries.map(([k])    => (catMap[k] || catMap.other).text);

  charts['dcd'] = new Chart(ctx, {
    type: 'doughnut',
    data: { labels, datasets: [{ data, backgroundColor: colors, borderWidth: 2, borderColor: '#16181f', hoverOffset: 4 }] },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '68%',
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: c => `${c.label}: ${formatINR(c.raw)}` } },
      },
    },
  });

  // Legend
  const leg = ge('dash-cat-legend');
  if (leg) {
    const total = data.reduce((a, b) => a + b, 0);
    leg.innerHTML = entries.slice(0, 4).map(([k, v]) => {
      const c   = catMap[k] || catMap.other;
      const pct = Math.round(v / total * 100);
      return `
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div style="width:8px;height:8px;border-radius:2px;background:${c.text};flex-shrink:0"></div>
            <span style="font-size:12px;color:var(--muted)">${c.label}</span>
          </div>
          <span style="font-size:12px;font-weight:700">${pct}%</span>
        </div>`;
    }).join('');
  }
}

/* ============================================================
   CUMULATIVE SPEND LINE
   ============================================================ */

function renderDashLine() {
  destroyChart('dll');
  const ctx = ge('dashLineChart'); if (!ctx) return;

  const sorted = [...state.expenses]
    .filter(e => e.paidBy === 'me')
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  let cum = 0;
  const labels = [];
  const data   = [];
  sorted.forEach(e => { cum += e.amount; labels.push(e.date.slice(5)); data.push(cum); });
  if (!labels.length) { labels.push('Now'); data.push(0); }

  charts['dll'] = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        data,
        borderColor: '#6ee7b7',
        backgroundColor: 'rgba(110,231,183,0.08)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#6ee7b7',
        pointRadius: 3,
        pointHoverRadius: 5,
        borderWidth: 2,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: c => '₹' + c.raw.toLocaleString('en-IN') } },
      },
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 10 } } },
        y: { grid: { color: 'rgba(42,45,58,0.6)' }, ticks: { callback: v => '₹' + (v / 1000) + 'k', font: { size: 10 } } },
      },
    },
  });
}

/* ============================================================
   FRIEND BALANCE BAR
   ============================================================ */

function renderDashBalanceBar() {
  destroyChart('dbb');
  const ctx     = ge('dashBalanceBar'); if (!ctx) return;
  const friends = state.friends.filter(f => f.balance !== 0).slice(0, 5);
  if (!friends.length) {
    if (ctx.parentElement) ctx.parentElement.innerHTML = '<div class="text-center py-4" style="color:var(--muted);font-size:12px">All settled! 🎉</div>';
    return;
  }

  charts['dbb'] = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: friends.map(f => f.name.split(' ')[0]),
      datasets: [{
        data: friends.map(f => f.balance),
        backgroundColor: friends.map(f => f.balance > 0 ? 'rgba(110,231,183,0.7)' : 'rgba(248,113,113,0.7)'),
        borderRadius: 4,
        borderSkipped: false,
      }],
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: c => (c.raw > 0 ? 'Owes you ' : 'You owe ') + formatINR(Math.abs(c.raw)) } },
      },
      scales: {
        x: { grid: { color: 'rgba(42,45,58,0.6)' }, ticks: { callback: v => '₹' + Math.abs(v / 1000) + 'k', font: { size: 10 } } },
        y: { grid: { display: false }, ticks: { font: { size: 11 } } },
      },
    },
  });
}

/* ============================================================
   BUDGET RING
   ============================================================ */

function renderDashBudgetRing() {
  destroyChart('dbr');
  const ctx   = ge('dashBudgetRing'); if (!ctx) return;
  const spent = monthlySpent();
  const limit = state.budget.total || 0;
  const pct   = limit > 0 ? Math.min(Math.round(spent / limit * 100), 100) : 0;
  const color = pct >= 100 ? '#f87171' : pct >= 80 ? '#fb923c' : '#6ee7b7';

  charts['dbr'] = new Chart(ctx, {
    type: 'doughnut',
    data: {
      datasets: [{
        data: [spent || 1, Math.max(limit - spent, 0)],
        backgroundColor: limit > 0 ? [color, '#2a2d3a'] : ['#2a2d3a', '#2a2d3a'],
        borderWidth: 0,
      }],
    },
    options: {
      cutout: '78%',
      plugins: { legend: { display: false }, tooltip: { enabled: false } },
      animation: { duration: 700 },
    },
  });

  const pctEl = ge('dash-ring-pct');
  if (pctEl) { pctEl.textContent = pct + '%'; pctEl.style.color = color; }

  const statEl = ge('dash-budget-status');
  if (statEl) statEl.textContent = limit > 0 ? `${formatINR(spent)} of ${formatINR(limit)}` : 'Set a budget to track';
}
