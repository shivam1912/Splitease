/**
 * auth.js
 * Register, login, logout logic.
 * Depends on: storage.js
 * NOTE: Does NOT reference AppData — that lives in state.js which loads after this file.
 *       The caller (boot.js / ui.js) is responsible for initialising state after auth.
 */
const Auth = {
  /**
   * Creates a new user account.
   * Caller must call AppData.load() / AppData.createEmpty() to set up state afterward.
   * @returns {{ success: boolean, user?: object, field?: string, msg?: string }}
   */
  register(name, email, password, phone = '') {
    const users = Storage.getUsers();
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, field: 'email', msg: 'Email already registered' };
    }
    const user = {
      id:       Date.now(),
      name:     name.trim(),
      email:    email.trim().toLowerCase(),
      password,
      phone,
    };
    users.push(user);
    Storage.saveUsers(users);
    // Persist empty data slot so AppData.load() finds it on next boot
    Storage.saveUserData(user.id, {
      friends: [], expenses: [], groups: [], reminders: [],
      budget: { total: 0, categories: { food:0, travel:0, rent:0, entertainment:0, utilities:0, other:0 } },
      splitType: 'equal', nextId: 1, addMemberTargetGroup: null, profile: { currency: 'INR' },
    });
    Storage.setCurrentUser({ id: user.id, name: user.name, email: user.email, phone: user.phone });
    return { success: true, user };
  },

  /**
   * Validates credentials and stores a session.
   * @returns {{ success: boolean, user?: object, field?: string, msg?: string }}
   */
  login(email, password) {
    const users = Storage.getUsers();
    const user  = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user)                      return { success: false, field: 'email',    msg: 'No account with this email' };
    if (user.password !== password) return { success: false, field: 'password', msg: 'Incorrect password' };
    Storage.setCurrentUser({ id: user.id, name: user.name, email: user.email, phone: user.phone });
    return { success: true, user };
  },

  /** Clears the active session */
  logout() { Storage.clearSession(); },

  /** Returns the currently-logged-in user object, or null */
  currentUser() { return Storage.getCurrentUser(); },
};
