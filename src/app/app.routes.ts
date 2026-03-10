import { Routes } from '@angular/router';

import { LoginComponent } from './pages/Login/login.component';
import { UserDashboard } from './pages/user-dashboard/user-dashboard';
import { AdminComponent } from './pages/admin/admin.component';
import { UsuariosComponent } from './pages/usuarios/usuarios';
import { VotacionComponent } from './pages/votos/votos';
import { PlanillasComponent } from './pages/planillas/planillas';
import { PlanillasPublicComponent } from './pages/planillas-public/planillas-public';
import { DashboardComponent } from './pages/dashboard/dashboard'
import { FormPlanillaComponent } from './pages/formplanilla/formplanilla';
import { AuthGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },

  { path: 'usuario', component: UserDashboard, canActivate: [AuthGuard] },

  { path: 'planillas', component: PlanillasPublicComponent, canActivate: [AuthGuard] },

  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard] },
  { path: 'admin/planillas', component: PlanillasComponent, canActivate: [AuthGuard] },
  { path: 'admin/usuarios', component: UsuariosComponent, canActivate: [AuthGuard] },
  { path: 'admin/dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'admin/planillas/nueva', component: FormPlanillaComponent, canActivate: [AuthGuard] },
  { path: 'admin/planillas/editar/:id', component: FormPlanillaComponent, canActivate: [AuthGuard] },
  { path: 'votacion', component: VotacionComponent, canActivate: [AuthGuard] },

  {
    path: '**',
    redirectTo: () => {
      const rol = localStorage.getItem('rol');

      if (rol === 'admin') return '/admin';
      if (rol === 'usuario') return '/usuario';

      return '/login';
    }
  }
];