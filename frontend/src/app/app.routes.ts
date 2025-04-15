import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SummaryComponent } from './pages/summary/summary.component';
import { ReportsComponent } from './pages/reports/reports.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'summary', component: SummaryComponent },
  { path: 'reports', component: ReportsComponent },
];
