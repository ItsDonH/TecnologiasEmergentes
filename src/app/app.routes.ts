import { Routes } from '@angular/router';
import { UserDashboard } from './pages/user-dashboard/user-dashboard';
import { AdminComponent } from './pages/admin/admin.component';

export const routes: Routes = [
  { path: 'usuario', component: UserDashboard },
  { path: 'admin', component: AdminComponent},
  { path: '', redirectTo: 'usuario', pathMatch: 'full' }
];