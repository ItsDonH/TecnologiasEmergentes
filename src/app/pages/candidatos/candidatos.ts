import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CandidatosService } from '../../services/candidatos.service';

@Component({
  selector: 'app-candidatos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './candidatos.html',
  styleUrls: ['./candidatos.css']
})
export class CandidatosComponent implements OnInit {

  carreraUsuario: string = '';
  candidatos: any[] = [];

  constructor(
    private candidatosService: CandidatosService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    this.carreraUsuario = localStorage.getItem('carrera') || '';

    if (this.carreraUsuario) {
      this.candidatos = await this.candidatosService.obtenerPorCarrera(
        this.carreraUsuario
      );

      // 🔥 FUERZA a Angular a refrescar el HTML
      this.cdr.detectChanges();

      console.log('Candidatos visibles:', this.candidatos);
    }
  }
}