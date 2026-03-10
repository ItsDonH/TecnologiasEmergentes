import { Component, OnInit, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ResultadosService } from '../../services/dashboard.service';
import { AuthService } from '../../services/auth.service';
import { Chart, registerables } from 'chart.js';
import { RouterModule, Router } from '@angular/router';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {

  votos: any[] = [];
  planillas: any[] = [];

  filtroCarrera: string = 'todas';
  filtroSede: string    = 'todas';
  tabActivo: string     = 'barras';

  carreras: string[] = [];
  sedes: string[]    = [];

  chartLabels: string[]  = [];
  chartData: number[]    = [];
  chartColores: string[] = [];

  cargando = true;
  chartBarras: Chart | null = null;
  chartDona:   Chart | null = null;

  // Orden de tabs para navegación con flechas
  private tabOrder = ['barras', 'dona', 'ambos'];

  private coloresPaleta = [
    '#6366f1', '#f59e0b', '#10b981', '#ef4444',
    '#3b82f6', '#ec4899', '#8b5cf6', '#14b8a6'
  ];

  constructor(
    private resultadosService: ResultadosService,
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
    private router: Router
  ) {}

  async ngOnInit() {
    await this.cargarDatos();
  }

  ngAfterViewInit() {
    if (!this.cargando) this.renderizarCharts();
  }

  ngOnDestroy() {
    this.chartBarras?.destroy();
    this.chartDona?.destroy();
  }

  async cargarDatos() {
    try {
      const [votos, planillas] = await Promise.all([
        this.resultadosService.obtenerVotos(),
        this.resultadosService.obtenerPlanillas()
      ]);

      this.votos     = votos;
      this.planillas = planillas;

      this.carreras = [...new Set(planillas.map(p => p.carrera).filter(Boolean))];
      this.sedes    = [...new Set(planillas.map(p => p.sede).filter(Boolean))];

      this.procesarDatos();
      this.cargando = false;
      this.cdr.detectChanges();

      setTimeout(() => this.renderizarCharts(), 100);
    } catch (e) {
      console.error('Error cargando resultados:', e);
      this.cargando = false;
    }
  }

  procesarDatos() {
    let planillasFiltradas = this.planillas.filter(p => {
      const okCarrera = this.filtroCarrera === 'todas' || p.carrera === this.filtroCarrera;
      const okSede    = this.filtroSede    === 'todas' || p.sede    === this.filtroSede;
      return okCarrera && okSede;
    });

    const idsFiltrados = new Set(planillasFiltradas.map(p => p.id));

    const conteo: Record<string, number> = {};
    for (const voto of this.votos) {
      if (idsFiltrados.has(voto.planillaId)) {
        conteo[voto.planillaId] = (conteo[voto.planillaId] || 0) + 1;
      }
    }

    this.chartLabels  = [];
    this.chartData    = [];
    this.chartColores = [];

    planillasFiltradas.forEach((p, i) => {
      this.chartLabels.push(p.partido || p.nombrePlanilla || `Planilla ${i + 1}`);
      this.chartData.push(conteo[p.id] || 0);
      this.chartColores.push(this.coloresPaleta[i % this.coloresPaleta.length]);
    });
  }

  aplicarFiltros() {
    this.procesarDatos();
    this.chartBarras?.destroy();
    this.chartDona?.destroy();
    setTimeout(() => this.renderizarCharts(), 50);
  }

  cambiarTab(tab: string) {
    this.tabActivo = tab;
    this.cdr.detectChanges();
    setTimeout(() => this.renderizarCharts(), 50);
  }

  // Navegación por teclado en tabs (flechas ← →, Home, End)
  onTabKeydown(event: KeyboardEvent, tabActual: string) {
    const idx = this.tabOrder.indexOf(tabActual);
    let siguiente: string | null = null;

    if (event.key === 'ArrowRight') siguiente = this.tabOrder[(idx + 1) % this.tabOrder.length];
    if (event.key === 'ArrowLeft')  siguiente = this.tabOrder[(idx - 1 + this.tabOrder.length) % this.tabOrder.length];
    if (event.key === 'Home')       siguiente = this.tabOrder[0];
    if (event.key === 'End')        siguiente = this.tabOrder[this.tabOrder.length - 1];

    if (siguiente) {
      event.preventDefault();
      this.cambiarTab(siguiente);
      // Mover el foco al botón del tab seleccionado
      setTimeout(() => {
        const btn = document.getElementById(`tab-${siguiente}`) as HTMLElement;
        btn?.focus();
      }, 0);
    }
  }

  renderizarCharts() {
    this.renderBarras();
    this.renderDona();
  }

  renderBarras() {
    const canvas = document.getElementById('chartBarras') as HTMLCanvasElement;
    if (!canvas) return;
    this.chartBarras?.destroy();

    this.chartBarras = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: this.chartLabels,
        datasets: [{
          label: 'Votos',
          data: this.chartData,
          backgroundColor: this.chartColores,
          borderRadius: 8,
          borderSkipped: false,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 2.5,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#1e293b',
            padding: 10,
            cornerRadius: 8,
            callbacks: {
              label: (ctx) => ` ${ctx.parsed.y} votos`
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { stepSize: 1, font: { size: 11 } },
            grid: { color: 'rgba(0,0,0,0.04)' },
            border: { display: false }
          },
          x: {
            grid: { display: false },
            ticks: { font: { size: 11 } },
            border: { display: false }
          }
        }
      }
    });
  }

  renderDona() {
    const canvas = document.getElementById('chartDona') as HTMLCanvasElement;
    if (!canvas) return;
    this.chartDona?.destroy();

    const total = this.chartData.reduce((a, b) => a + b, 0);

    this.chartDona = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: this.chartLabels,
        datasets: [{
          data: this.chartData,
          backgroundColor: this.chartColores,
          borderWidth: 3,
          borderColor: '#fff',
          hoverOffset: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 1.8,
        cutout: '70%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 20,
              usePointStyle: true,
              pointStyleWidth: 8,
              font: { size: 12 }
            }
          },
          tooltip: {
            backgroundColor: '#1e293b',
            padding: 10,
            cornerRadius: 8,
            callbacks: {
              label: (ctx) => {
                const pct = total > 0 ? ((ctx.parsed / total) * 100).toFixed(1) : 0;
                return ` ${ctx.label}: ${ctx.parsed} votos (${pct}%)`;
              }
            }
          }
        }
      }
    });
  }

  get totalVotos(): number {
    return this.chartData.reduce((a, b) => a + b, 0);
  }

  exportarCSV() {
    const encabezado = ['#', 'Partido', 'Presidente', 'Carrera', 'Sede', 'Votos', '%'];

    const filas = this.planillas.map((p, i) => {
      const votos = this.chartData[i] || 0;
      const pct = this.totalVotos > 0 ? ((votos / this.totalVotos) * 100).toFixed(1) : '0';
      return [i + 1, p.partido, p.presidente, p.carrera, p.sede, votos, `${pct}%`];
    });

    const contenido = [encabezado, ...filas]
      .map(fila => fila.join(','))
      .join('\n');

    const blob = new Blob([contenido], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `resultados_elecciones_${new Date().toLocaleDateString('es-HN')}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  async cerrarSesion() {
    await this.authService.logout();
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }

  get ganador(): string {
    if (!this.chartData.length) return '—';
    const maxIdx = this.chartData.indexOf(Math.max(...this.chartData));
    return this.chartLabels[maxIdx] || '—';
  }
}