/**
 * state.js
 * Application state management and persistence.
 * Depends on: storage.js, auth.js
 */

/* ---- AppData ---- */
const AppData = {
  /** Returns a fresh, empty state object */
  createEmpty() {
    return {
      friends:              [],
      expenses:             [],
      groups:               [],
      reminders:            [],
      budget: {
        total: 0,
        categories: { food: 0, travel: 0, rent: 0, entertainment: 0, utilities: 0, other: 0 },
      },
      splitType:            'equal',
      nextId:               1,
      addMemberTargetGroup: null,
      profile:              { currency: 'INR' },
    };
  },

  /** Loads state from localStorage for the current user */
  load() {
    const user  = Auth.currentUser();
    if (!user)  return this.createEmpty();
    const saved = Storage.getUserData(user.id);
    return saved || this.createEmpty();
  },

  /** Persists current state to localStorage */
  save() {
    const user = Auth.currentUser();
    if (!user) return;
    Storage.saveUserData(user.id, state);
  },
};

/* ---- Global mutable state ---- */
// Initialised to empty; replaced with real data on login.
let state = AppData.createEmpty();

/* ---- Chart registry ---- */
// Holds Chart.js instances keyed by a short string so we can destroy them cleanly.
let charts = {};

/* ---- UI state ---- */
let expenseFilter  = 'all';
let expenseSearch  = '';
let settleTarget   = null;
