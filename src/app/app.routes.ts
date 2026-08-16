import { Routes } from '@angular/router';

export const routes: Routes = [
     {
    path: 'schools',
    loadComponent: () =>
      import('./features/schools/schools')
        .then(m => m.Schools)
  },
   {
    path: 'schools/new',
    loadComponent: () =>
      import('./features/school-form/school-form')
        .then(m => m.SchoolForm)
  },
  {
    path: 'schools/:id/edit',
    loadComponent: () =>
      import('./features/school-form/school-form')
        .then(m => m.SchoolForm)
  },

   {
    path: 'students',
    loadComponent: () =>
      import('./features/students/students')
        .then(m => m.Students)
  },

  {
    path: 'students/new',
    loadComponent: () =>
      import('./features/student-form/student-form')
        .then(m => m.StudentForm)
  },

  {
    path: 'students/:id/edit',
    loadComponent: () =>
      import('./features/student-form/student-form')
        .then(m => m.StudentForm)
  },

  {
    path: '',
    redirectTo: 'schools',
    pathMatch: 'full'
  }

];
