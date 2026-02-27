import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlanillasService } from '../../services/planillas.service';
import { AuthService } from '../../services/auth.service';
import { EstudiantesService } from '../../services/estudiantes.service';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-planillas-public',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './planillas-public.html'
})
export class PlanillasPublicComponent implements OnInit {

  planillas: any[] = [];
  estudiante: any = null;

  cargando: boolean = true;
  mensajeError: string = '';

  constructor(
    private planillasService: PlanillasService,
    private authService: AuthService,
    private estudiantesService: EstudiantesService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  async ngOnInit() {
    await this.cargarDatos();
  }

      async irAlHome() {
  await this.router.navigate(['/usuario']);
}

  cerrarSesion() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  async cargarDatos() {
    try {
      this.cargando = true;

      const user = await this.authService.getCurrentUser();

      if (!user) {
        this.mensajeError = 'Debes iniciar sesión.';
        this.cargando = false;
        return;
      }

      const estudianteData = await this.estudiantesService.obtenerPorCorreo(user.email!);

      if (!estudianteData) {
        this.mensajeError = 'No se encontró información del estudiante.';
        this.cargando = false;
        return;
      }

      this.estudiante = estudianteData;

      this.planillas = await this.planillasService.obtenerPlanillasPorCarrera(
        this.estudiante.carrera
      );

      this.cargando = false;
      this.cdr.detectChanges();

    } catch (error) {
      console.error('Error al cargar planillas públicas:', error);
      this.mensajeError = 'Error al cargar planillas.';
      this.cargando = false;
      this.cdr.detectChanges();
    }
  }
}