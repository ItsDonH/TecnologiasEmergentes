import { Component, OnInit, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ResultadosService } from '../../services/dashboard.service';
import { Chart, registerables } from 'chart.js';
import { RouterModule } from '@angular/router';

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

  // Filtros
  filtroCarrera: string = 'todas';
  filtroSede: string    = 'todas';
  tabActivo: string     = 'barras';

  // Opciones de filtro (se generan dinámicamente)
  carreras: string[] = [];
  sedes: string[]    = [];

  // Datos procesados para charts
  chartLabels: string[]  = [];
  chartData: number[]    = [];
  chartColores: string[] = [];

  cargando = true;
  chartBarras: Chart | null = null;
  chartDona:   Chart | null = null;

  private coloresPaleta = [
    '#6366f1', '#f59e0b', '#10b981', '#ef4444',
    '#3b82f6', '#ec4899', '#8b5cf6', '#14b8a6'
  ];

  constructor(
    private resultadosService: ResultadosService,
    private cdr: ChangeDetectorRef
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

      // Extraer carreras y sedes únicas
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
    // Filtrar planillas según selección
    let planillasFiltradas = this.planillas.filter(p => {
      const okCarrera = this.filtroCarrera === 'todas' || p.carrera === this.filtroCarrera;
      const okSede    = this.filtroSede    === 'todas' || p.sede    === this.filtroSede;
      return okCarrera && okSede;
    });

    const idsFiltrados = new Set(planillasFiltradas.map(p => p.id));

    // Contar votos solo de las planillas filtradas
    const conteo: Record<string, number> = {};
    for (const voto of this.votos) {
      if (idsFiltrados.has(voto.planillaId)) {
        conteo[voto.planillaId] = (conteo[voto.planillaId] || 0) + 1;
      }
    }

    // Construir labels y data
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
          borderRadius: 10,
          borderSkipped: false,
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${ctx.parsed.y} votos`
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { stepSize: 1 },
            grid: { color: 'rgba(0,0,0,0.05)' }
          },
          x: {
            grid: { display: false }
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
          hoverOffset: 10
        }]
      },
      options: {
        responsive: true,
        cutout: '65%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: { padding: 16, usePointStyle: true }
          },
          tooltip: {
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

  get ganador(): string {
    if (!this.chartData.length) return '—';
    const maxIdx = this.chartData.indexOf(Math.max(...this.chartData));
    return this.chartLabels[maxIdx] || '—';
  }
}
