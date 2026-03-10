import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PlanillasService } from '../../services/planillas.service';

@Component({
  selector: 'app-formplanilla',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './formplanilla.html'
})
export class FormPlanillaComponent implements OnInit {

  editando = false;
  id: string | null = null;

  planilla: any = {
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
    private route: ActivatedRoute,
    private router: Router
  ) { }

  async ngOnInit() {

    this.route.params.subscribe(async params => {

      this.id = params['id'];

      if (this.id) {

        this.editando = true;

        const planilla = await this.planillasService.obtenerPlanilla(this.id);

      
        if (!planilla) {
          alert("La planilla no existe");
          this.router.navigate(['/admin']);
          return;
        }

        this.planilla = { ...planilla };

      }

    });

  }

  async guardar() {

    if (!this.planilla.partido || !this.planilla.carrera || !this.planilla.presidente) {
      alert("Complete los campos obligatorios");
      return;
    }

    if (this.editando && this.id) {
      await this.planillasService.actualizarPlanilla(this.id, this.planilla);
    } else {
      await this.planillasService.crearPlanilla(this.planilla);
    }

    this.router.navigate(['/admin/planillas']);
  }

  cancelar() {

    this.planilla = {
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

    this.router.navigate(['/admin/planillas']);

  }
}