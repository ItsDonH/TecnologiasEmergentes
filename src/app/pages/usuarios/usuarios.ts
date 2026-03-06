import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { EstudiantesService } from '../../services/estudiantes.service';
import { NavbarComponent } from '../../components/navbar.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './usuarios.html',
  styleUrls: ['./usuarios.css']
})
export class UsuariosComponent implements OnInit {

  usuarios: any[] = [];

  constructor(
    private estudiantesService: EstudiantesService,
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
    private router: Router
  ) {}

  async ngOnInit() {
    this.usuarios = await this.estudiantesService.obtenerEstudiantes();
    this.cdr.detectChanges();
  }

  mostrarVoto(valor: boolean): string {
    return valor ? 'Sí votó' : 'Pendiente';
  }

  votaron(): number {
    return this.usuarios.filter(u => u.yaVoto).length;
  }

  noVotaron(): number {
    return this.usuarios.filter(u => !u.yaVoto).length;
  }

  async irAlHome() {
    await this.router.navigate(['/admin']);
  }

  async cerrarSesion() {
  await this.authService.logout();
  localStorage.clear();
  sessionStorage.clear();
  this.router.navigate(['/login']);
}
}