import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {

    const user = await this.authService.getAuthState();

    if (!user) {
      this.router.navigate(['/login']);
      return false;
    }

    const rol = localStorage.getItem('rol');
    const url = route.routeConfig?.path || '';

    // rutas de admin
    const adminRoutes = [
      'admin',
      'admin/planillas',
      'admin/usuarios',
      'admin/dashboard'
    ];

    // rutas de usuario
    const userRoutes = [
      'usuario',
      'planillas',
      'votacion'
    ];

    if (rol === 'admin' && userRoutes.includes(url)) {
      this.router.navigate(['/admin']);
      return false;
    }

    if (rol !== 'admin' && adminRoutes.includes(url)) {
      this.router.navigate(['/usuario']);
      return false;
    }

    return true;
  }
}