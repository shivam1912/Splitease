/**
 * storage.js
 * Low-level localStorage helpers.
 * All keys are centralised here so they're easy to change.
 */
const Storage = {
  USERS_KEY:   'splitease_users',
  SESSION_KEY: 'splitease_session',

  /** Returns the per-user data key */
  dataKey(userId) { return `splitease_data_${userId}`; },

  /* ---- User registry ---- */
  getUsers()        { try { return JSON.parse(localStorage.getItem(this.USERS_KEY)) || []; } catch { return []; } },
  saveUsers(users)  { localStorage.setItem(this.USERS_KEY, JSON.stringify(users)); },

  /* ---- Session ---- */
  getCurrentUser()        { try { return JSON.parse(localStorage.getItem(this.SESSION_KEY)); } catch { return null; } },
  setCurrentUser(user)    { localStorage.setItem(this.SESSION_KEY, JSON.stringify(user)); },
  clearSession()          { localStorage.removeItem(this.SESSION_KEY); },

  /* ---- Per-user data ---- */
  getUserData(userId)           { try { return JSON.parse(localStorage.getItem(this.dataKey(userId))); } catch { return null; } },
  saveUserData(userId, data)    { localStorage.setItem(this.dataKey(userId), JSON.stringify(data)); },
  removeUserData(userId)        { localStorage.removeItem(this.dataKey(userId)); },
};
