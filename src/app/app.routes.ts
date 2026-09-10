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
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard')
            .then((m) => m.Dashboard)
      },
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
        path: 'teachers',
        loadComponent: () =>
          import('./features/teachers/teachers')
            .then((m) => m.Teachers)
      },
      {
        path: 'teachers/new',
        loadComponent: () =>
          import('./features/teacher-form/teacher-form')
            .then((m) => m.TeacherForm)
      },
      {
        path: 'teachers/:id/edit',
        loadComponent: () =>
          import('./features/teacher-form/teacher-form')
            .then((m) => m.TeacherForm)
      },
      {
        path: 'subjects',
        loadComponent: () =>
          import('./features/subjects/subjects')
            .then((m) => m.Subjects)
      },
      {
        path: 'subjects/new',
        loadComponent: () =>
          import('./features/subject-form/subject-form')
            .then((m) => m.SubjectForm)
      },
      {
        path: 'subjects/:id/edit',
        loadComponent: () =>
          import('./features/subject-form/subject-form')
            .then((m) => m.SubjectForm)
      },
      {
        path: 'classes',
        loadComponent: () =>
          import('./features/classes/classes')
            .then((m) => m.Classes)
      },
      {
        path: 'classes/new',
        loadComponent: () =>
          import('./features/class-form/class-form')
            .then((m) => m.ClassForm)
      },
      {
        path: 'classes/:id/edit',
        loadComponent: () =>
          import('./features/class-form/class-form')
            .then((m) => m.ClassForm)
      },
      {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  }
];
