import { Routes } from '@angular/router';

import { authGuard, publicOnlyGuard } from './auth/auth.guard';
import { AppShell } from './features/app-shell/app-shell';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [publicOnlyGuard],
    loadComponent: () =>
      import('./features/login/login')
        .then((m) => m.LoginComponent)
  },
  {
    path: '',
    component: AppShell,
    canActivate: [authGuard],
    children: [
      {
        path: 'schools',
        loadComponent: () =>
          import('./features/schools/schools')
            .then((m) => m.Schools)
      },
      {
        path: 'schools/new',
        loadComponent: () =>
          import('./features/school-form/school-form')
            .then((m) => m.SchoolForm)
      },
      {
        path: 'schools/:id/edit',
        loadComponent: () =>
          import('./features/school-form/school-form')
            .then((m) => m.SchoolForm)
      },
      {
        path: 'students',
        loadComponent: () =>
          import('./features/students/students')
            .then((m) => m.Students)
      },
      {
        path: 'students/new',
        loadComponent: () =>
          import('./features/student-form/student-form')
            .then((m) => m.StudentForm)
      },
      {
        path: 'students/:id/edit',
        loadComponent: () =>
          import('./features/student-form/student-form')
            .then((m) => m.StudentForm)
      },
      {
        path: 'parents',
        loadComponent: () =>
          import('./features/parents/parents')
            .then((m) => m.Parents)
      },
      {
        path: 'parents/new',
        loadComponent: () =>
          import('./features/parent-form/parent-form')
            .then((m) => m.ParentForm)
      },
      {
        path: 'parents/:id/edit',
        loadComponent: () =>
          import('./features/parent-form/parent-form')
            .then((m) => m.ParentForm)
      },
      {
        path: '',
        redirectTo: '/schools',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/schools',
    pathMatch: 'full'
  }
];
