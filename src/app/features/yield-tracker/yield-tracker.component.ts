import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BatchService } from '../../core/services/batch.service';
import { EnzymeService } from '../../core/services/enzyme.service';
import { OrganismService } from '../../core/services/organism.service';
import { CsvExportService } from '../../core/services/csv-export.service';
import { Batch, Enzyme, Organism } from '../../core/models';
import { Observable, combineLatest, map, startWith, take } from 'rxjs';
import { YieldChartComponent } from './yield-chart/yield-chart.component';

@Component({
  selector: 'app-yield-tracker',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, YieldChartComponent],
  template: `
    <div class="container mx-auto px-4 py-8">
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gradient">Promiscuity Yield Tracker</h1>
          <p class="text-gray-600 dark:text-gray-400 mt-2">
            Track 1-to-many cannabinoid outputs from CBGA
          </p>
        </div>
        <div class="flex gap-3">
          <button
            (click)="exportToCSV()"
            class="btn bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
            📥 Export CSV
          </button>
          <button
            routerLink="/yield-tracker/new"
            class="btn btn-primary">
            <span class="text-xl mr-2">+</span>
            New Batch
          </button>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="glass-card p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400">Total Batches</p>
              <p class="text-3xl font-bold mt-2">{{ (filteredBatches$ | async)?.length || 0 }}</p>
            </div>
            <div class="w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center">
              <span class="text-2xl">📊</span>
            </div>
          </div>
        </div>

        <div class="glass-card p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400">Active Enzymes</p>
              <p class="text-3xl font-bold mt-2">{{ (enzymes$ | async)?.length || 0 }}</p>
            </div>
            <div class="w-12 h-12 bg-success-100 dark:bg-success-900/20 rounded-lg flex items-center justify-center">
              <span class="text-2xl">🧬</span>
            </div>
          </div>
        </div>

        <div class="glass-card p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400">Organisms</p>
              <p class="text-3xl font-bold mt-2">{{ (organisms$ | async)?.length || 0 }}</p>
            </div>
            <div class="w-12 h-12 bg-warning-100 dark:bg-warning-900/20 rounded-lg flex items-center justify-center">
              <span class="text-2xl">🦠</span>
            </div>
          </div>
        </div>

        <div class="glass-card p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400">Peak Yields</p>
              <p class="text-3xl font-bold mt-2">{{ peakYieldCount }}</p>
            </div>
            <div class="w-12 h-12 bg-error-100 dark:bg-error-900/20 rounded-lg flex items-center justify-center">
              <span class="text-2xl">🏆</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="glass-card p-6 mb-8">
        <h2 class="text-lg font-semibold mb-4">Filters</h2>
        <form [formGroup]="filterForm" class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Enzyme
            </label>
            <select
              formControlName="enzymeId"
              class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
              <option value="">All Enzymes</option>
              @for (enzyme of (enzymes$ | async); track enzyme.id) {
                <option [value]="enzyme.id">{{ enzyme.name }}</option>
              }
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Organism
            </label>
            <select
              formControlName="organismId"
              class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
              <option value="">All Organisms</option>
              @for (organism of (organisms$ | async); track organism.id) {
                <option [value]="organism.id">{{ organism.name }}</option>
              }
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status
            </label>
            <select
              formControlName="status"
              class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
              <option value="">All Statuses</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="peak-yield">Peak Yield</option>
            </select>
          </div>

          <div class="flex items-end">
            <button
              type="button"
              (click)="clearFilters()"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
              Clear Filters
            </button>
          </div>
        </form>
      </div>

      <!-- Yield Visualization -->
      @if ((filteredBatches$ | async) && (filteredBatches$ | async)!.length > 0) {
        <div class="glass-card p-6 mb-8">
          <h2 class="text-xl font-bold mb-4">Yield Trends</h2>
          <div class="h-80">
            <app-yield-chart
              [data]="(filteredBatches$ | async)!"
              [chartType]="'bar'"
              [title]="'Cannabinoid Output Distribution'">
            </app-yield-chart>
          </div>
        </div>
      }

      <!-- Recent Batches Table -->
      <div class="glass-card p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold">Recent Batches</h2>
          @if ((filteredBatches$ | async) && (filteredBatches$ | async)!.length > 0) {
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Showing {{ (filteredBatches$ | async)!.length }} batch(es)
            </p>
          }
        </div>
        
        @if ((filteredBatches$ | async) && (filteredBatches$ | async)!.length > 0) {
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b border-gray-200 dark:border-gray-700">
                  <th class="text-left py-3 px-4">Enzyme</th>
                  <th class="text-left py-3 px-4">Organism</th>
                  <th class="text-left py-3 px-4">CBGA Input</th>
                  <th class="text-left py-3 px-4">THCA %</th>
                  <th class="text-left py-3 px-4">CBDA %</th>
                  <th class="text-left py-3 px-4">CBCA %</th>
                  <th class="text-left py-3 px-4">Status</th>
                  <th class="text-left py-3 px-4">Date</th>
                  <th class="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                @for (batch of (filteredBatches$ | async); track batch.id) {
                  <tr class="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      [ngClass]="{
                        'bg-yellow-50 dark:bg-yellow-900/10': batch.status === 'peak-yield'
                      }">
                    <td class="py-3 px-4 font-medium">{{ batch.enzymeName || 'N/A' }}</td>
                    <td class="py-3 px-4 text-sm">{{ batch.organismName || 'N/A' }}</td>
                    <td class="py-3 px-4">{{ batch.cbgaInput }} mg</td>
                    <td class="py-3 px-4">{{ batch.outputs.thca.toFixed(1) }}%</td>
                    <td class="py-3 px-4">{{ batch.outputs.cbda.toFixed(1) }}%</td>
                    <td class="py-3 px-4">{{ batch.outputs.cbca.toFixed(1) }}%</td>
                    <td class="py-3 px-4">
                      <span
                        class="px-2 py-1 rounded-full text-xs font-medium"
                        [ngClass]="{
                          'bg-success-100 text-success-800 dark:bg-success-900/20 dark:text-success-200': batch.status === 'completed',
                          'bg-warning-100 text-warning-800 dark:bg-warning-900/20 dark:text-warning-200': batch.status === 'in-progress',
                          'bg-primary-100 text-primary-800 dark:bg-primary-900/20 dark:text-primary-200': batch.status === 'peak-yield'
                        }">
                        {{ batch.status === 'peak-yield' ? '🏆 Peak' : batch.status }}
                      </span>
                    </td>
                    <td class="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                      {{ batch.timestamp | date:'short' }}
                    </td>
                    <td class="py-3 px-4">
                      <button
                        [routerLink]="['/yield-tracker', batch.id]"
                        class="text-primary-600 hover:text-primary-700 text-sm font-medium">
                        View
                      </button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        } @else {
          <div class="text-center py-12">
            <div class="text-6xl mb-4">📊</div>
            <h3 class="text-xl font-semibold mb-2">No batches found</h3>
            <p class="text-gray-600 dark:text-gray-400 mb-4">
              {{ filterForm.value.enzymeId || filterForm.value.organismId || filterForm.value.status 
                ? 'Try adjusting your filters or create a new batch' 
                : 'Start tracking your cannabinoid yields by creating your first batch' }}
            </p>
            <button routerLink="/yield-tracker/new" class="btn btn-primary">
              Create First Batch
            </button>
          </div>
        }
      </div>
    </div>
  `
})
export class YieldTrackerComponent implements OnInit {
  private batchService = inject(BatchService);
  private enzymeService = inject(EnzymeService);
  private organismService = inject(OrganismService);
  private csvExportService = inject(CsvExportService);
  private fb = inject(FormBuilder);

  batches$!: Observable<Batch[]>;
  enzymes$!: Observable<Enzyme[]>;
  organisms$!: Observable<Organism[]>;
  filteredBatches$!: Observable<Batch[]>;
  peakYieldCount = 0;

  filterForm!: FormGroup;

  ngOnInit(): void {
    this.batches$ = this.batchService.getAllBatches();
    this.enzymes$ = this.enzymeService.getAllEnzymes();
    this.organisms$ = this.organismService.getAllOrganisms();

    // Initialize filter form
    this.filterForm = this.fb.group({
      enzymeId: [''],
      organismId: [''],
      status: ['']
    });

    // Include initial form values so the table renders on first load.
    this.filteredBatches$ = combineLatest([
      this.batches$,
      this.filterForm.valueChanges.pipe(startWith(this.filterForm.value))
    ]).pipe(
      map(([batches, filters]) => this.applyFilters(batches, filters))
    );

    // Calculate peak yield count
    this.batches$.subscribe(batches => {
      this.peakYieldCount = batches.filter(b => b.status === 'peak-yield').length;
    });
  }

  private applyFilters(batches: Batch[], filters: any): Batch[] {
    return batches.filter(batch => {
      if (filters.enzymeId && batch.enzymeId !== filters.enzymeId) {
        return false;
      }
      if (filters.organismId && batch.organismId !== filters.organismId) {
        return false;
      }
      if (filters.status && batch.status !== filters.status) {
        return false;
      }
      return true;
    });
  }

  clearFilters(): void {
    this.filterForm.reset({
      enzymeId: '',
      organismId: '',
      status: ''
    });
  }

  exportToCSV(): void {
    this.filteredBatches$.pipe(take(1)).subscribe(batches => {
      if (batches.length > 0) {
        this.csvExportService.exportBatches(batches, 'yield-tracker-batches.csv');
      }
    });
  }
}
