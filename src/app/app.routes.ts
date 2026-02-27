import { Route } from '@angular/router';
import { LoginComponent } from './admin/pages/login/login.component';

export const routes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboards',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'dashboards',
    loadChildren: () => import('./admin/admin.module').then((m) => m.AdminModule),
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
