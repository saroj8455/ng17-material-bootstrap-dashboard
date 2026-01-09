import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AnalyticsComponent } from './pages/analytics/analytics.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { ReportsComponent } from './pages/reports/reports.component';
import { authGuard } from './auth.guard';
import { guestGuard } from './guest.guard';
import { RegisterComponent } from './pages/register/register.component';
import { PostsComponent } from './pages/posts/posts.component';
import { PostDetailsComponent } from './pages/post-details/post-details.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';

// export const routes: Routes = [
//     { path: '', redirectTo: 'login', pathMatch: 'full' },
//     {path:'login',component:LoginComponent,canActivate: [guestGuard]},
//     {path:'register',component:RegisterComponent, canActivate: [guestGuard]},
//     {path:'dashboard',component:DashboardComponent,canActivate: [authGuard]},
//     {path:'analytics',component:AnalyticsComponent},
//     {path:'posts',component:PostsComponent,canActivate: [authGuard]},
//     { path: 'posts/:id', component: PostDetailsComponent, canActivate: [authGuard] },
//     {path:'reports',component:ReportsComponent},
//     {path:'settings',component:SettingsComponent}
// ];

export const routes: Routes = [
  // ==============================================================
  // 1. PUBLIC ROUTES (Lazy Loaded)
  // ==============================================================
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    // Lazy Load: Only downloads the Login code when needed
    loadComponent: () =>
      import('./pages/login/login.component').then((c) => c.LoginComponent),
    canActivate: [guestGuard],
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register.component').then(
        (c) => c.RegisterComponent
      ),
    canActivate: [guestGuard],
  },

  // ==============================================================
  // 2. PROTECTED ROUTES (Grouped & Lazy Loaded)
  // ==============================================================
  // We can group these to apply the Guard ONCE for all children
  {
    path: '',
    canActivate: [authGuard], // <--- Applies to all children below
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dashboard/dashboard.component').then(
            (c) => c.DashboardComponent
          ),
      },
      {
        path: 'analytics',
        loadComponent: () =>
          import('./pages/analytics/analytics.component').then(
            (c) => c.AnalyticsComponent
          ),
      },
      {
        path: 'posts',
        loadComponent: () =>
          import('./pages/posts/posts.component').then((c) => c.PostsComponent),
      },
      {
        path: 'posts/:id',
        loadComponent: () =>
          import('./pages/post-details/post-details.component').then(
            (c) => c.PostDetailsComponent
          ),
      },
      // {
      //   path: 'reports',
      //   loadComponent: () =>
      //     import('./pages/reports/reports.component').then(
      //       (c) => c.ReportsComponent
      //     ),
      // },
      {
        path: 'settings',
        loadComponent: () =>
          import('./pages/settings/settings.component').then(
            (c) => c.SettingsComponent
          ),
      },
    ],
  },

  // ==============================================================
  // 3. WILDCARD ROUTE (Must be last)
  // ==============================================================
  // Handles typos like /dashbaord -> Redirects to dashboard (or a 404 page)
  // {
  //   path: '**',
  //   redirectTo: 'dashboard'
  // }
  {
    path: 'reports',
    loadComponent: () =>
      import('./pages/reports/reports.component').then(
        (c) => c.ReportsComponent
      ),
  },
  {
    path: 'contacts',
    loadComponent: () =>
      import('./pages/contact-list/contact-list.component').then(
        (c) => c.ContactListComponent
      ),
  },
  {
    path: '**',
    component: PageNotFoundComponent,
  },
];
