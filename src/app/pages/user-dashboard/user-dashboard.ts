import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { EstudiantesService } from '../../services/estudiantes.service';
import { VotosService } from '../../services/votos.service';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-dashboard.html',
  styleUrls: ['./user-dashboard.css']
})
export class UserDashboard implements OnInit {

  yaVoto: boolean = false;
  estudiante: any = null;

  constructor(
    private router: Router,
    private authService: AuthService,
    private estudiantesService: EstudiantesService,
    private votosService: VotosService
  ) {}

 async ngOnInit() {
  const local = localStorage.getItem('yaVoto');
  if (local === 'true') {
    this.yaVoto = true;
  }

  await this.cargarEstado();
}
  async cargarEstado() {
    const user = await this.authService.getCurrentUser();
    if (!user) return;

    const estudianteData = await this.estudiantesService.obtenerPorCorreo(user.email!);
    if (!estudianteData) return;

    this.estudiante = estudianteData;
    this.yaVoto = await this.votosService.yaVoto(this.estudiante.id);
  }

  mostrarAlerta = false;

irAVotar() {
  if (this.yaVoto) {
    this.mostrarAlerta = true;
    setTimeout(() => this.mostrarAlerta = false, 4000); // se oculta solo
    return;
  }
  this.router.navigate(['/votacion']);
}

  cerrarSesion() {
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}