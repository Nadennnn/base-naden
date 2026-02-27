import { Route } from '@angular/router';
import { authGuard } from '../admin/guards/auth.guard';
import { AdminComponent } from './admin.component';
import { AlokasiComponent } from './pages/alokasi/alokasi.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { MonitoringComponent } from './pages/monitoring/monitoring.component';
import { PendapatanComponent } from './pages/pendapatan/pendapatan.component';
import { PengeluaranComponent } from './pages/pengeluaran/pengeluaran.component';

export const AdminRoutes: Route[] = [
  {
    path: '',
    component: AdminComponent,
    canActivate: [authGuard], // ← semua child route terlindungi
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'pendapatan', component: PendapatanComponent },
      { path: 'pengeluaran', component: PengeluaranComponent },
      { path: 'monitoring', component: MonitoringComponent },
      { path: 'alokasi', component: AlokasiComponent },
    ],
  },
];
