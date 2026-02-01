import { Routes } from '@angular/router';
import { UserDashboard } from './pages/user-dashboard/user-dashboard';

export const routes: Routes = [
  { path: 'usuario', component: UserDashboard },
  { path: '', redirectTo: 'usuario', pathMatch: 'full' }
];