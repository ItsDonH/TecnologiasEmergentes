import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { VotosService } from '../../services/votos.service';
import { AuthService } from '../../services/auth.service';
import { EstudiantesService } from '../../services/estudiantes.service';
import { PlanillasService } from '../../services/planillas.service';

@Component({
  selector: 'app-votacion',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './votos.html',
  styleUrls: ['./votos.css']
})
export class VotacionComponent implements OnInit {
  planillas: any[] = [];
  estudiante: any = null;
  yaVoto: boolean = false;
  cargando: boolean = true;
  votando: boolean = false;
  planillaSeleccionada: any | null = null;
  mostrarConfirmacion: boolean = false;
  mensajeExito: boolean = false;
  mensajeError: string = '';

  constructor(
    private planillasService: PlanillasService,
    private votosService: VotosService,
    private authService: AuthService,
    private estudiantesService: EstudiantesService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    await this.cargarEstudiante();
  }

  async cargarEstudiante() {
    const user = await this.authService.getCurrentUser();
    if (!user) {
      this.mensajeError = 'Debes iniciar sesión';
      this.cargando = false;
      return;
    }

    const estudianteData = await this.estudiantesService.obtenerPorCorreo(user.email!);
    if (!estudianteData) {
      this.mensajeError = 'No se encontró el estudiante';
      this.cargando = false;
      return;
    }

    this.estudiante = estudianteData;

    // Validación: carrera + sede
    if (!this.estudiante.carrera || !this.estudiante.sede) {
      this.mensajeError = 'No se encontró la carrera o sede del estudiante.';
      this.cargando = false;
      return;
    }

    await this.inicializar();
  }

  async inicializar() {
    this.yaVoto = await this.votosService.yaVoto(this.estudiante.id);
    if (!this.yaVoto) {
      this.planillas = await this.planillasService.obtenerPlanillasPorCarreraYSede(
        this.estudiante.carrera,
        this.estudiante.sede
      );
    }
    this.cargando = false;
    this.cdr.detectChanges();
  }

  seleccionarPlanilla(planilla: any) {
    if (this.yaVoto || this.votando) return;
    this.planillaSeleccionada = planilla;
    this.mostrarConfirmacion = true;
  }

  cancelarVoto() {
    this.mostrarConfirmacion = false;
    this.planillaSeleccionada = null;
  }

  async cerrarSesion() {
    await this.authService.logout();
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }

  async confirmarVoto() {
    if (!this.planillaSeleccionada) return;

    // Validación extra: la planilla debe ser de la misma sede del estudiante
    if (this.planillaSeleccionada.sede !== this.estudiante.sede) {
      this.mensajeError = 'No puedes votar por una planilla de otra sede.';
      this.mostrarConfirmacion = false;
      return;
    }

    this.votando = true;
    await this.votosService.registrarVoto({
      estudianteId: this.estudiante.id,
      planillaId: this.planillaSeleccionada.id,
      sede: this.estudiante.sede,
      fecha: new Date()
    });

    this.yaVoto = true;
    localStorage.setItem('yaVoto', 'true');
    this.mostrarConfirmacion = false;
    this.mensajeExito = true;
    this.votando = false;

    setTimeout(() => {
      this.router.navigate(['/usuario']);
    }, 1000);
  }
}