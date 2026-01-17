import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

// Register Chart.js components
Chart.register(...registerables);

@Component({
  selector: 'app-yield-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-full h-full">
      <canvas #chartCanvas></canvas>
    </div>
  `
})
export class YieldChartComponent implements AfterViewInit, OnDestroy {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;
  @Input() data: any[] = [];
  @Input() chartType: 'bar' | 'line' | 'pie' | 'doughnut' = 'bar';
  @Input() title: string = '';
  
  private chart?: Chart;

  ngAfterViewInit(): void {
    this.createChart();
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  private createChart(): void {
    if (!this.chartCanvas || !this.data.length) return;

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    // Prepare data for cannabinoid outputs
    const labels = this.data.map((_, index) => `Batch ${index + 1}`);
    const thcaData = this.data.map(d => d.outputs?.thca || 0);
    const cbdaData = this.data.map(d => d.outputs?.cbda || 0);
    const cbcaData = this.data.map(d => d.outputs?.cbca || 0);

    const config: ChartConfiguration = {
      type: this.chartType,
      data: {
        labels,
        datasets: [
          {
            label: 'THCA %',
            data: thcaData,
            backgroundColor: 'rgba(139, 92, 246, 0.5)',
            borderColor: 'rgb(139, 92, 246)',
            borderWidth: 2
          },
          {
            label: 'CBDA %',
            data: cbdaData,
            backgroundColor: 'rgba(34, 197, 94, 0.5)',
            borderColor: 'rgb(34, 197, 94)',
            borderWidth: 2
          },
          {
            label: 'CBCA %',
            data: cbcaData,
            backgroundColor: 'rgba(251, 146, 60, 0.5)',
            borderColor: 'rgb(251, 146, 60)',
            borderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          title: {
            display: !!this.title,
            text: this.title,
            font: {
              size: 16,
              weight: 'bold'
            }
          },
          legend: {
            display: true,
            position: 'top'
          },
          tooltip: {
            mode: 'index',
            intersect: false
          }
        },
        scales: this.chartType === 'bar' || this.chartType === 'line' ? {
          y: {
            beginAtZero: true,
            max: 100,
            title: {
              display: true,
              text: 'Percentage (%)'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Batches'
            }
          }
        } : undefined
      }
    };

    this.chart = new Chart(ctx, config);
  }

  updateChart(newData: any[]): void {
    this.data = newData;
    if (this.chart) {
      this.chart.destroy();
    }
    this.createChart();
  }
}
