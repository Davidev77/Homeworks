import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/auth.guard';

export const routes: Routes = [
  { path: 'login', canActivate: [guestGuard],
    loadComponent: () => import('./pages/auth.component').then((m) => m.AuthComponent) },
  { path: 'tasks', canActivate: [authGuard],
    loadComponent: () => import('./pages/tasks.component').then((m) => m.TasksComponent) },
  { path: '', pathMatch: 'full', redirectTo: 'tasks' },
  { path: '**', redirectTo: 'tasks' },
];
