import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { PlanillasService } from '../../services/planillas.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { NavbarComponent } from '../../components/navbar.component';
import { AuthService } from '../../services/auth.service';
import * as bootstrap from 'bootstrap';

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

  // Estado para el modal de confirmación
  planillaAEliminarId: string | null = null;
  planillaAEliminarNombre = '';

  // CORRECCIÓN: guardar la instancia del modal como propiedad de la clase
  private modalEliminar: any = null;

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

  // ✅ CORRECCIÓN: usar getOrCreateInstance() y guardar la referencia
  confirmarEliminar(id: string, nombre: string) {
    this.planillaAEliminarId = id;
    this.planillaAEliminarNombre = nombre;

    const modalEl = document.getElementById('modalEliminar');
    if (modalEl) {
      // getOrCreateInstance evita duplicar instancias
      this.modalEliminar = bootstrap.Modal.getOrCreateInstance(modalEl);
      this.modalEliminar.show();
    }
  }

  // ✅ CORRECCIÓN: cerrar usando la instancia guardada, no getInstance()
  async ejecutarEliminar() {
    if (this.planillaAEliminarId) {
      await this.planillasService.eliminarPlanilla(this.planillaAEliminarId);
      this.planillaAEliminarId = null;
      this.planillaAEliminarNombre = '';

      // Cierra con la instancia guardada
      this.modalEliminar?.hide();
      this.modalEliminar = null;

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