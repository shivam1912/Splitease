/**
 * helpers.js
 * Shared constants and pure utility functions.
 * Depends on: state.js
 */

/* ---- Avatar colour palette ---- */
const avatarBgs    = ['rgba(110,231,183,0.2)','rgba(129,140,248,0.2)','rgba(251,146,60,0.2)','rgba(248,113,113,0.2)','rgba(56,189,248,0.2)','rgba(167,139,250,0.2)'];
const avatarColors = ['#6ee7b7','#818cf8','#fb923c','#f87171','#38bdf8','#a78bfa'];

/* ---- Category metadata ---- */
const catMap = {
  food:          { icon: '🍔', color: 'rgba(251,146,60,0.15)',  text: '#fb923c', label: 'Food' },
  travel:        { icon: '✈️', color: 'rgba(56,189,248,0.15)',  text: '#38bdf8', label: 'Travel' },
  rent:          { icon: '🏠', color: 'rgba(129,140,248,0.15)', text: '#818cf8', label: 'Rent' },
  entertainment: { icon: '🎬', color: 'rgba(167,139,250,0.15)', text: '#a78bfa', label: 'Entertainment' },
  utilities:     { icon: '💡', color: 'rgba(251,191,36,0.15)',  text: '#fbbf24', label: 'Utilities' },
  other:         { icon: '📦', color: 'rgba(107,114,128,0.15)', text: '#9ca3af', label: 'Other' },
};

/* ---- Chart colour ramp ---- */
const CHART_COLORS = ['#6ee7b7','#818cf8','#fb923c','#f87171','#38bdf8','#a78bfa','#fbbf24'];

/* ---- Helpers object ---- */
const Helpers = {
  /** Returns uppercased initials (up to 2 chars) from a full name */
  getInitials(n) { return n.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2); },

  /** Looks up a friend from global state by id */
  getFriend(id) { return state.friends.find(f => f.id == id); },

  /** Formats a number as ₹ with Indian locale grouping */
  formatINR(n) { return '₹' + Number(n).toLocaleString('en-IN'); },

  /** Returns today's date as YYYY-MM-DD */
  today() { return new Date().toISOString().split('T')[0]; },

  /** Formats an ISO date string to "1 Jan 2025" */
  dateStr(d) { return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }); },

  /** Shorthand for document.getElementById */
  ge(id) { return document.getElementById(id); },

  /** Renders an avatar div HTML string for a friend object */
  avatarEl(f, size = 38) {
    const bg  = avatarBgs[f.color % avatarBgs.length];
    const clr = avatarColors[f.color % avatarColors.length];
    return `<div class="avatar" style="background:${bg};color:${clr};width:${size}px;height:${size}px;font-size:${size < 40 ? 13 : 16}px">${f.initials}</div>`;
  },

  /** Total amount paid by the current user across all expenses */
  monthlySpent() { return state.expenses.filter(e => e.paidBy === 'me').reduce((s, e) => s + e.amount, 0); },

  /** Spending per category (only expenses paid by 'me') */
  catSpent() {
    const cs = {};
    state.expenses.filter(e => e.paidBy === 'me').forEach(e => {
      cs[e.category] = (cs[e.category] || 0) + e.amount;
    });
    return cs;
  },

  /** Returns and increments the global ID counter */
  nextId() { return state.nextId++; },
};

/* ---- Convenience aliases (used throughout without Helpers. prefix) ---- */
const { ge, formatINR, today, dateStr, avatarEl, getFriend, monthlySpent, catSpent, getInitials } = Helpers;
