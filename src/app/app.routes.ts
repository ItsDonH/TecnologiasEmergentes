import { Routes } from '@angular/router';
import { LoginComponent } from './pages/Login/login.component';
import { UserDashboard } from './pages/user-dashboard/user-dashboard';
import { AdminComponent } from './pages/admin/admin.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'usuario', component: UserDashboard },
  { path: 'admin', component: AdminComponent},
  { path: '**', redirectTo: 'login' }
];