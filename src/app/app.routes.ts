// src/app/app.routes.ts
import { Route } from '@angular/router';

export const routes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboards',
  },
  {
    path: 'dashboards',
    loadChildren: () => import('./admin/admin.module').then((m) => m.AdminModule),
  },
  {
    path: '**',
    redirectTo: 'login-bridge',
  },
];
