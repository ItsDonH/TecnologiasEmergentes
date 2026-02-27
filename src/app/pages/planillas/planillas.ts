import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { PlanillasService } from '../../services/planillas.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-planillas',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './planillas.html'
})
export class PlanillasComponent implements OnInit {

  planillas: any[] = [];
  editandoId: string | null = null;

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
    if (
      !this.nueva.partido ||
      !this.nueva.carrera ||
      !this.nueva.presidente
    ) {
      alert('Complete los campos obligatorios');
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

  async actualizar() {
    if (this.editandoId) {
      await this.planillasService.actualizarPlanilla(this.editandoId, this.nueva);
      this.resetFormulario();
      await this.cargarPlanillas();
    }
  }

  async eliminar(id: string) {
    if (confirm('¿Eliminar planilla?')) {
      await this.planillasService.eliminarPlanilla(id);
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

  cerrarSesion() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}