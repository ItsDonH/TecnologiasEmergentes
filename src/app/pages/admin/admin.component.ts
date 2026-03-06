import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { NavbarComponent } from '../../components/navbar.component';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {

constructor(
  private authService: AuthService,
  private router: Router
) {}

  async cerrarSesion() {
  await this.authService.logout();
  localStorage.clear();
  sessionStorage.clear();
  this.router.navigate(['/login']);
}
}