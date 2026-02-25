import { Routes } from '@angular/router';

import { LoginComponent } from './pages/Login/login.component';
import { UserDashboard } from './pages/user-dashboard/user-dashboard';
import { AdminComponent } from './pages/admin/admin.component';
import { UsuariosComponent } from './pages/usuarios/usuarios';
import { VotacionComponent } from './pages/votos/votos';
import { PlanillasComponent } from './pages/planillas/planillas';
import { PlanillasPublicComponent } from './pages/planillas-public/planillas-public';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },

  { path: 'usuario', component: UserDashboard },

  // 🔥 RUTA PUBLICA (ESTUDIANTE)
  { path: 'planillas', component: PlanillasPublicComponent },

  // 🔥 RUTAS ADMIN
  { path: 'admin', component: AdminComponent },
  { path: 'admin/planillas', component: PlanillasComponent },
  { path: 'admin/usuarios', component: UsuariosComponent },

  { path: 'votacion', component: VotacionComponent },

  { path: '**', redirectTo: 'login' }
];