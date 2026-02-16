import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CandidatosService } from '../../services/candidatos.service';

@Component({
  selector: 'app-admin-candidatos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admincan.html',
  styleUrls: ['./admincan.css']
})
export class AdminCandidatosComponent implements OnInit {

  candidatos: any[] = [];

  nuevo: any = {
    nombre: '',
    ncasilla: '',
    carrera: '',
    descripcion: '',
    npartido: ''
  };

  
  editandoId: string | null = null;

  constructor(
    private candidatosService: CandidatosService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  async ngOnInit() {
    await this.cargar();
  }

  
  cerrarSesion() {
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }

 
  async cargar() {
    this.candidatos = await this.candidatosService.obtenerTodos();
    this.cdr.detectChanges();
  }

  
  async crear() {
    if (
      !this.nuevo.nombre ||
      !this.nuevo.ncasilla ||
      !this.nuevo.carrera ||
      !this.nuevo.npartido
    ) {
      alert('Complete todos los campos obligatorios');
      return;
    }

    await this.candidatosService.crear(this.nuevo);
    this.limpiarFormulario();
    await this.cargar();
  }

  
  editar(c: any) {
    this.editandoId = c.id;
    this.nuevo = {
      nombre: c.nombre,
      ncasilla: c.ncasilla,
      carrera: c.carrera,
      descripcion: c.descripcion,
      npartido: c.npartido
    };
  }


  async actualizar() {
    if (!this.editandoId) return;

    await this.candidatosService.actualizar(this.editandoId, this.nuevo);
    this.limpiarFormulario();
    await this.cargar();
  }

  
  async eliminar(id: string) {
    if (confirm('¿Eliminar candidato?')) {
      await this.candidatosService.eliminar(id);
      await this.cargar();
    }
  }

   cancelarEdicion() {
    this.limpiarFormulario();
  }


  
  limpiarFormulario() {
    this.nuevo = {
      nombre: '',
      ncasilla: '',
      carrera: '',
      descripcion: '',
      npartido: ''
    };
    this.editandoId = null;
  }
}
