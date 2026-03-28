# SplitEase ⚡

> **Split expenses effortlessly** — real-time balance tracking, smart reminders, and beautiful analytics. No backend required.

![SplitEase Preview](https://img.shields.io/badge/status-active-brightgreen) ![License](https://img.shields.io/badge/license-MIT-blue) ![Vanilla JS](https://img.shields.io/badge/JS-Vanilla-yellow)

---

## ✨ Features

| Feature | Description |
|---|---|
| **Instant Splitting** | Equal, percentage, or exact splits |
| **Rich Analytics** | 5 interactive Chart.js visualisations |
| **Smart Reminders** | Set nudges with due dates for friends |
| **Budget Limits** | Per-category monthly limits with 80% warnings |
| **Groups** | Trip / home / work groups with member management |
| **Settle Up** | One-tap settlement via UPI, cash, or bank transfer |
| **Auth System** | Client-side register / login backed by localStorage |
| **Zero backend** | Fully offline, no server required |

---

## 📁 Project Structure

```
splitease/
├── index.html                  # Entry point — loads all CSS & JS
│
├── css/
│   ├── variables.css           # CSS custom properties (design tokens)
│   ├── base.css                # Reset, body, animations
│   ├── landing.css             # Landing page styles
│   ├── auth.css                # Auth card styles
│   ├── app.css                 # Sidebar, layout, section styles
│   └── components.css          # Shared: buttons, inputs, modals, badges
│
├── js/
│   ├── storage.js              # localStorage helpers
│   ├── auth.js                 # Register / login / logout logic
│   ├── state.js                # Global state + AppData persistence
│   ├── helpers.js              # Constants (catMap, avatarColors) + utilities
│   ├── ui.js                   # Navigation, toast, modals, auth form handlers
│   ├── render.js               # All DOM-rendering functions
│   ├── charts.dashboard.js     # Dashboard Chart.js charts
│   ├── charts.analytics.js     # Analytics page Chart.js charts
│   ├── actions.js              # All CRUD operations
│   ├── app.js                  # launchApp, logout, sidebar/settings user update
│   └── boot.js                 # DOMContentLoaded session check
│
└── pages/
    ├── landing.js              # Landing page HTML template (injected)
    ├── auth.js                 # Auth page HTML template (injected)
    ├── app.js                  # App shell HTML template (injected)
    └── modals.js               # All modals HTML template (injected)
```

---

## 🚀 Getting Started

### Option 1 — Open directly
Just open `index.html` in any modern browser. No build step needed.

### Option 2 — Local dev server (recommended)

```bash
# Python 3
python -m http.server 8080

# Node.js (npx)
npx serve .

# VS Code
# Install the "Live Server" extension and click "Go Live"
```

Then visit `http://localhost:8080`.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Styling | Tailwind CSS (CDN) + custom CSS variables |
| Charts | Chart.js 4.4.1 |
| Fonts | Cabinet Grotesk, Instrument Serif, Syne (Google Fonts) |
| Icons | Font Awesome 6.5 |
| Storage | Browser `localStorage` |
| Runtime | Vanilla JavaScript (ES6+) — zero dependencies, no bundler |

---

## 📦 Module Responsibilities

### `js/storage.js`
Pure localStorage wrapper. All key names live here — one place to change them.

### `js/auth.js`
Register, login, logout. Validates emails/passwords and stores a lightweight session object.

### `js/state.js`
Defines the shape of application state, provides `AppData.load()` / `AppData.save()`, and declares the global `state`, `charts`, and UI-state variables.

### `js/helpers.js`
Stateless utilities (`formatINR`, `dateStr`, `avatarEl`, etc.) plus the `catMap` and colour constants shared across the whole app.

### `js/ui.js`
Page/section switching, mobile sidebar, toast, modal open/close, auth-tab switching, and the login/register form submission handlers.

### `js/render.js`
Every function that writes to the DOM: dashboard stats, expense rows, friends, groups, reminders, settings limits, and the modal data-refresh that populates dropdowns.

### `js/charts.dashboard.js`
Five Chart.js charts for the Dashboard: monthly bar, category donut, cumulative line, friend-balance bar, and budget ring.

### `js/charts.analytics.js`
Six Chart.js charts for the Analytics section: budget donut, category progress bars, category doughnut, monthly trend, friend bar, and cumulative line.

### `js/actions.js`
All user-triggered mutations: add/delete expense, add/remove friend, add/remove group, add/delete/send reminder, settle up, budget save, profile save, delete-all-data.

### `js/app.js`
`launchApp()`, `logout()`, and sidebar/settings user-display helpers.

### `js/boot.js`
Single `DOMContentLoaded` listener that checks for an existing session and either calls `launchApp()` or `showPage('landing')`.

### `pages/*.js`
Each file injects its HTML string into the corresponding container div via `innerHTML`. Keeps HTML out of `index.html` and makes each page's markup easy to find and edit.

---

## 🔒 Data & Privacy

All data is stored **only in your browser's localStorage**. Nothing is sent to any server. Clearing browser data or using incognito mode will reset the app.

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/my-feature`
3. Commit your changes: `git commit -m "feat: add my feature"`
4. Push the branch: `git push origin feat/my-feature`
5. Open a pull request

---

## 📄 License

MIT © 2025 SplitEase
