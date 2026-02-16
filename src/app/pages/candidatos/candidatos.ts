import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CandidatosService } from '../../services/candidatos.service';
import { AuthService } from '../../services/auth.service';

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
  error: string = '';

  constructor(
    private candidatosService: CandidatosService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    this.carreraUsuario = localStorage.getItem('carrera') || '';

    if (this.carreraUsuario) {
      this.candidatos = await this.candidatosService.obtenerPorCarrera(
        this.carreraUsuario
      );

      
      this.cdr.detectChanges();

      console.log('Candidatos visibles:', this.candidatos);
    }
  }

  
  async logout() {
    try {
      await this.authService.logout();
      localStorage.removeItem('carrera');
      localStorage.removeItem('yaVoto');
      this.router.navigate(['/login']);
    } catch (err) {
      this.error = 'Error al cerrar sesión';
      console.error(err);
    }
  }
}
