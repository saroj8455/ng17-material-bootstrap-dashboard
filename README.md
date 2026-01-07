# 🚀 ng17-material-bootstrap-dashboard

![Angular](https://img.shields.io/badge/Angular-17.0-DD0031?style=for-the-badge&logo=angular)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-563D7C?style=for-the-badge&logo=bootstrap)
![Material](https://img.shields.io/badge/Material-Design-blue?style=for-the-badge&logo=materialdesign)

A robust, mobile-first Admin Dashboard starter kit. This project demonstrates how to effectively combine **Bootstrap's grid system** with **Angular Material components** in a **Standalone Component** architecture. It includes a complete authentication flow, protected routes, and optimized responsive tables.

# Angular 17 Admin Dashboard

A modern, responsive Admin Dashboard built with **Angular 17 (Standalone Components)**. It features secure authentication, lazy-loaded routing, reactive forms, and a mobile-first UI using Bootstrap 5 & Angular Material.

## 🚀 Features

### 🔐 Authentication & Security

- **Login/Register:** Secure authentication flow using [DummyJSON API](https://dummyjson.com).
- **Route Guards:**
  - `AuthGuard`: Protects private routes (Dashboard, Posts, etc.).
  - `GuestGuard`: Prevents logged-in users from accessing Login/Register pages.
- **State Management:** `BehaviorSubject` based reactive state for instant UI updates (e.g., Sidebar Logout button).
- **Session Handling:** Auto-redirects and local storage token management.

### 📊 Dashboard & Analytics

- **Responsive Charts:** Visual data representation using `ng2-charts` (Chart.js).
- **KPI Cards:** Mobile-optimized statistic cards with dynamic sizing (`clamp()` logic).
- **User Welcome:** Personalized welcome banner with user profile image.

### 📝 Post Management

- **Data Table:** Responsive Angular Material table.
  - _Desktop:_ Shows Title, Body, Tags, Likes, Views.
  - _Mobile:_ Automatically hides complex columns to fit screen width perfectly.
- **Details View:** Dynamic routing (`/posts/:id`) to view full post details.
- **Loaders:** Custom centralized loading spinners.

### 🛠 Architecture & Performance

- **Angular 17 Standalone:** No `NgModules` (`app.module.ts`), using `app.config.ts`.
- **Lazy Loading:** All routes are lazy-loaded for optimal initial bundle size.
- **Strict Versioning:** Project dependencies are locked via `package-lock.json` and strict engine rules.

---

## 🛠 Tech Stack

- **Framework:** Angular 17
- **Styling:** Bootstrap 5, Angular Material, Bootstrap Icons
- **Data Visualization:** ng2-charts, Chart.js
- **HTTP:** Angular HttpClient (Interceptors & Observables)
- **Routing:** Angular Router (Lazy Loading, Functional Guards)

---

## ⚙️ Installation

This project enforces strict versioning. Please use `npm ci` to ensure you install the exact dependencies locked in the project.

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd <project-folder>
   ```

## base template for page

```html
<div class="d-flex align-items-center justify-content-center">
  <div class="w-100 p-4">
    <h1 class="text-center mb-5 fw-bold text-secondary">settings works!</h1>
  </div>
</div>
```

- npm install @capacitor/core@6 @capacitor/cli@6 --legacy-peer-deps
- npx cap init
- npm install @capacitor/android --legacy-peer-deps
- npx cap add android
- npx cap sync
- npx cap open android
- npm install @capacitor/status-bar --legacy-peer-deps
- npx cap sync
- https://developer.android.com/studio/write/create-app-icons
