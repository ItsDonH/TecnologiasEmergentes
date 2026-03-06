import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  // Ruta del botón Home (si no se pasa, el botón no aparece)
  @Input() homeRoute: string = '';

  // Texto del botón Home (por defecto 'Home', personalizable por página)
  @Input() homeLabel: string = 'Home';

  constructor(private router: Router) {}

  irAlHome() {
    if (this.homeRoute) {
      this.router.navigate([this.homeRoute]);
    }
  }

  mostrarHome(): boolean {
    const rutas = ['/votacion', '/resultados', '/perfil'];
    return rutas.includes(this.router.url);
  }

  cerrarSesion() {
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}