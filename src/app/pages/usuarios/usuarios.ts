import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { EstudiantesService } from '../../services/estudiantes.service';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './usuarios.html',
  styleUrls: ['./usuarios.css']
})
export class UsuariosComponent implements OnInit {

  usuarios: any[] = [];

  constructor(
    private estudiantesService: EstudiantesService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  async ngOnInit() {
    this.usuarios = await this.estudiantesService.obtenerEstudiantes();
    this.cdr.detectChanges();

    console.log('Usuarios cargados:', this.usuarios);
  }

  mostrarVoto(valor: boolean): string {
    return valor ? 'Sí' : 'No';
  }

  cerrarSesion() {
    localStorage.clear(); 
    sessionStorage.clear();

    this.router.navigate(['/login']);
  }
}
