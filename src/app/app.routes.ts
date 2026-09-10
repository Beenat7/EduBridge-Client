import { Routes } from '@angular/router';

import { authGuard, publicOnlyGuard } from './auth/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [publicOnlyGuard],
    loadComponent: () =>
      import('./features/login/login')
        .then((m) => m.LoginComponent)
  },
  {
    path: 'schools',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/schools/schools')
        .then((m) => m.Schools)
  },
  {
    path: 'schools/new',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/school-form/school-form')
        .then((m) => m.SchoolForm)
  },
  {
    path: 'schools/:id/edit',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/school-form/school-form')
        .then((m) => m.SchoolForm)
  },
  {
    path: 'students',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/students/students')
        .then((m) => m.Students)
  },
  {
    path: 'students/new',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/student-form/student-form')
        .then((m) => m.StudentForm)
  },
  {
    path: 'students/:id/edit',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/student-form/student-form')
        .then((m) => m.StudentForm)
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  }
];
