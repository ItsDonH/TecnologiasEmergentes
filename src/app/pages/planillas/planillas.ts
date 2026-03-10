import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { PlanillasService } from '../../services/planillas.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { NavbarComponent } from '../../components/navbar.component';
import { AuthService } from '../../services/auth.service';

declare const bootstrap: any; // Bootstrap JS disponible globalmente

@Component({
  selector: 'app-planillas',
  standalone: true,
  imports: [FormsModule, CommonModule, NavbarComponent],
  templateUrl: './planillas.html',
  styleUrls: ['./planillas.css']
})
export class PlanillasComponent implements OnInit {

  planillas: any[] = [];
  editandoId: string | null = null;

  // ① Estado para el modal de confirmación (reemplaza confirm())
  planillaAEliminarId: string | null = null;
  planillaAEliminarNombre = '';

  nueva: any = {
    carrera: '',
    partido: '',
    lema: '',
    presidente: '',
    vicepresidente: '',
    secretario: '',
    tesorero: '',
    sede: '',
    propuesta: ''
  };

  constructor(
    private planillasService: PlanillasService,
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
    private router: Router
  ) { }

  async ngOnInit() {
    await this.cargarPlanillas();
  }

  async cargarPlanillas() {
    this.planillas = await this.planillasService.obtenerPlanillas();
    this.cdr.detectChanges();
  }

  async crear() {
    if (!this.nueva.partido || !this.nueva.carrera || !this.nueva.presidente) {
      // Sin alert() — la validación se maneja en el formulario formplanilla
      return;
    }
    await this.planillasService.crearPlanilla(this.nueva);
    this.resetFormulario();
    await this.cargarPlanillas();
  }

  editar(p: any) {
    this.editandoId = p.id;
    this.nueva = { ...p };
  }

  irACrear() {
    this.router.navigate(['/admin/planillas/nueva']);
  }

  irAEditar(id: string) {
    this.router.navigate(['/admin/planillas/editar', id]);
  }

  async actualizar() {
    if (this.editandoId) {
      await this.planillasService.actualizarPlanilla(this.editandoId, this.nueva);
      this.resetFormulario();
      await this.cargarPlanillas();
    }
  }

  // ② Abre el modal accesible en lugar de confirm()
  confirmarEliminar(id: string, nombre: string) {
    this.planillaAEliminarId = id;
    this.planillaAEliminarNombre = nombre;

    const modalEl = document.getElementById('modalEliminar');
    if (modalEl) {
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
    }
  }

  // ③ Se llama desde el botón "Sí, eliminar" del modal
  async ejecutarEliminar() {
    if (this.planillaAEliminarId) {
      await this.planillasService.eliminarPlanilla(this.planillaAEliminarId);
      this.planillaAEliminarId = null;
      this.planillaAEliminarNombre = '';

      // Cerrar el modal programáticamente
      const modalEl = document.getElementById('modalEliminar');
      if (modalEl) {
        const modal = bootstrap.Modal.getInstance(modalEl);
        modal?.hide();
      }

      await this.cargarPlanillas();
    }
  }

  cancelarEdicion() {
    this.resetFormulario();
  }

  resetFormulario() {
    this.editandoId = null;
    this.nueva = {
      carrera: '',
      partido: '',
      lema: '',
      presidente: '',
      vicepresidente: '',
      secretario: '',
      tesorero: '',
      sede: '',
      propuesta: ''
    };
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