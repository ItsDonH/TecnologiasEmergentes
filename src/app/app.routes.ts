import { Routes } from '@angular/router';

import { LoginComponent } from './pages/Login/login.component';
import { UserDashboard } from './pages/user-dashboard/user-dashboard';
import { AdminComponent } from './pages/admin/admin.component';
import { CandidatosComponent } from './pages/candidatos/candidatos';
import { UsuariosComponent } from './pages/usuarios/usuarios';
import { AdminCandidatosComponent } from './pages/admincan/admincan';
import { VotacionComponent } from './pages/votos/votos';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },

  { path: 'usuario', component: UserDashboard },

  { path: 'candidatos', component: CandidatosComponent },

  { path: 'admin', component: AdminComponent },

  { path: 'admin/candidatos', component: AdminCandidatosComponent },

  { path: 'admin/usuarios', component: UsuariosComponent },

  { path: 'votacion', component: VotacionComponent },

  { path: '**', redirectTo: 'login' }
];