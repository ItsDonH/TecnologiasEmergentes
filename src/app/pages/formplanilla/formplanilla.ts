import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PlanillasService } from '../../services/planillas.service';

@Component({
  selector: 'app-formplanilla',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './formplanilla.html',
  styles: [`
    /* ── Skip link ── */
    .skip-link {
      position: absolute;
      top: -100%;
      left: 0;
      z-index: 9999;
      padding: .75rem 1.25rem;
      background: #0d47a1;
      color: #fff;
      font-weight: 700;
      font-size: .95rem;
      border-radius: 0 0 .5rem 0;
      text-decoration: none;
      transition: top .15s;
    }
    .skip-link:focus { top: 0; }

    /* ── Focus visible global ── */
    :focus-visible {
      outline: 3px solid #0d47a1;
      outline-offset: 3px;
    }

    /* ── Etiquetas ── */
    .form-label {
      font-size: .8rem;
      font-weight: 600;
      color: #374151;
      margin-bottom: .3rem;
    }

    /* ── Inputs ── */
    .form-control,
    .form-select {
      border-color: #9ca3af;
      color: #111827;
      font-size: .9rem;
    }
    .form-control:focus,
    .form-select:focus {
      border-color: #0d47a1;
      box-shadow: 0 0 0 3px rgba(13,71,161,.2);
    }
    .form-control::placeholder { color: #6b7280; }

    /* ── Errores ── */
    .invalid-feedback {
      color: #b91c1c;
      font-size: .78rem;
      font-weight: 500;
    }

    /* ── Grupos con fieldset ── */
    .field-group {
      border: 1px solid #e5e7eb;
      border-radius: .6rem;
      padding: 1rem 1rem .25rem;
    }
    .field-group-legend {
      font-size: .75rem;
      font-weight: 700;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: .06em;
      padding: 0 .35rem;
      width: auto;
    }

    /* ── Mensaje de estado (aria-live) ── */
    .form-status-msg {
      min-height: 1.4rem;
      font-size: .85rem;
      font-weight: 600;
      color: #14532d;
      margin-bottom: .5rem;
    }

    /* ── Botón primario con contraste WCAG AA ── */
    .btn-primary {
      background: #1565c0;
      border-color: #1565c0;
      font-weight: 600;
    }
    .btn-primary:hover,
    .btn-primary:focus-visible {
      background: #0d47a1;
      border-color: #0d47a1;
    }

    /* ── Botón secundario ── */
    .btn-outline-secondary {
      color: #374151;
      border-color: #9ca3af;
      font-weight: 600;
    }
    .btn-outline-secondary:hover,
    .btn-outline-secondary:focus-visible {
      background: #f3f4f6;
      color: #111827;
    }
  `]
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
        if (planilla) {
          this.planilla = { ...planilla };
        }
      }
    });
  }

  async guardar() {
    // La validación de campos requeridos se maneja en el template
    // con ngForm.submitted + *ngIf + aria-invalid.
    // Este guard solo aplica si se llama guardar() sin pasar por el form.
    if (!this.planilla.partido || !this.planilla.carrera || !this.planilla.presidente) {
      this.emitirEstado('Por favor, completa los campos obligatorios marcados con asterisco.');
      return;
    }

    try {
      if (this.editando && this.id) {
        await this.planillasService.actualizarPlanilla(this.id, this.planilla);
      } else {
        await this.planillasService.crearPlanilla(this.planilla);
      }
      this.router.navigate(['/admin/planillas']);
    } catch (error) {
      // Mensaje de error anunciado por aria-live — sin alert()
      this.emitirEstado('Ocurrió un error al guardar la planilla. Intenta de nuevo.');
    }
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

  /**
   * Escribe un mensaje en la región aria-live del formulario.
   * Los lectores de pantalla lo anuncian automáticamente.
   */
  private emitirEstado(mensaje: string): void {
    const region = document.getElementById('form-status');
    if (region) {
      // Forzar re-anuncio aunque el texto sea igual
      region.textContent = '';
      setTimeout(() => region.textContent = mensaje, 50);
    }
  }
}