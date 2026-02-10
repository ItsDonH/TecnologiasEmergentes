import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CandidatosService } from '../../services/candidatos.service';
import { VotosService } from '../../services/votos.service';
import { AuthService } from '../../services/auth.service';
import { EstudiantesService } from '../../services/estudiantes.service';

@Component({
  selector: 'app-votacion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './votos.html',
  styleUrls: ['./votos.css']
})
export class VotacionComponent implements OnInit {

  candidatos: any[] = [];
  
 
  estudiante: any = null;


  yaVoto: boolean = false;
  cargando: boolean = true;
  votando: boolean = false;


  candidatoSeleccionado: any | null = null;
  mostrarConfirmacion: boolean = false;


  mensajeExito: boolean = false;
  mensajeError: string = '';

  constructor(
    private candidatosService: CandidatosService,
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
    try {
      const user = await this.authService.getCurrentUser();
      
      if (!user) {
        this.mensajeError = 'Debes iniciar sesión para votar';
        this.cargando = false;
        // Opcional: redirigir al login
        // this.router.navigate(['/login']);
        this.cdr.detectChanges();
        return;
      }

      // Obtener datos del estudiante desde Firestore
      const estudianteData = await this.estudiantesService.obtenerPorCorreo(user.email!);
      
      if (!estudianteData) {
        this.mensajeError = 'No se encontró información del estudiante';
        this.cargando = false;
        this.cdr.detectChanges();
        return;
      }

      this.estudiante = estudianteData;
      await this.inicializar();
      
    } catch (error) {
      console.error('Error al cargar estudiante:', error);
      this.mensajeError = 'Error al cargar datos del estudiante';
      this.cargando = false;
      this.cdr.detectChanges();
    }
  }

  async inicializar() {
    try {
      this.cargando = true;
      
      // Verificar si ya votó
      this.yaVoto = await this.votosService.yaVoto(this.estudiante.id);
      
      // Cargar candidatos de su carrera
      if (!this.yaVoto) {
        this.candidatos = await this.candidatosService.obtenerPorCarrera(
          this.estudiante.carrera
        );
      }
      
      this.cargando = false;
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error al inicializar:', error);
      this.mensajeError = 'Error al cargar los datos';
      this.cargando = false;
      this.cdr.detectChanges();
    }
  }

 
  seleccionarCandidato(candidato: any) {
    if (this.yaVoto || this.votando) return;
    
    this.candidatoSeleccionado = candidato;
    this.mostrarConfirmacion = true;
  }


  cancelarVoto() {
    this.mostrarConfirmacion = false;
    this.candidatoSeleccionado = null;
  }


  async confirmarVoto() {
    if (!this.candidatoSeleccionado || this.yaVoto) return;

    try {
      this.votando = true;
      this.mensajeError = '';

      await this.votosService.registrarVoto(
        this.estudiante.id,
        this.candidatoSeleccionado.id
      );

      // Voto exitoso
      this.yaVoto = true;
      this.mostrarConfirmacion = false;
      this.mensajeExito = true;
      this.votando = false;
      
      // Ocultar mensaje de éxito después de 3 segundos
      setTimeout(() => {
        this.mensajeExito = false;
        this.cdr.detectChanges();
      }, 3000);

      this.cdr.detectChanges();
    } catch (error: any) {
      console.error('Error al votar:', error);
      this.mensajeError = error.message || 'Error al registrar el voto';
      this.votando = false;
      this.mostrarConfirmacion = false;
      this.cdr.detectChanges();
    }
  }
}