import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { BatchService } from '../../../core/services/batch.service';
import { Batch } from '../../../core/models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-batch-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mx-auto px-4 py-8 max-w-4xl">
      <button routerLink="/yield-tracker" class="text-primary-600 hover:text-primary-700 mb-4">
        ← Back to Yield Tracker
      </button>

      @if (batch$ | async; as batch) {
        <div class="glass-card p-8">
          <div class="flex justify-between items-start mb-6">
            <div>
              <h1 class="text-3xl font-bold">Batch Details</h1>
              <p class="text-gray-600 dark:text-gray-400 mt-2">{{ batch.enzymeName }}</p>
            </div>
            <span
              class="px-3 py-1 rounded-full text-sm font-medium"
              [ngClass]="{
                'bg-success-100 text-success-800': batch.status === 'completed',
                'bg-warning-100 text-warning-800': batch.status === 'in-progress',
                'bg-primary-100 text-primary-800': batch.status === 'peak-yield'
              }"
            >
              {{ batch.status === 'peak-yield' ? '🏆 Peak Yield' : batch.status }}
            </span>
          </div>

          <div class="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label class="text-sm text-gray-600 dark:text-gray-400">CBGA Input</label>
              <p class="text-2xl font-bold">{{ batch.cbgaInput }} mg</p>
            </div>
            <div>
              <label class="text-sm text-gray-600 dark:text-gray-400">Created By</label>
              <p class="text-lg">{{ batch.labTechName }}</p>
            </div>
          </div>

          <div class="mb-6">
            <h3 class="text-lg font-semibold mb-3">Cannabinoid Outputs</h3>
            <div class="grid grid-cols-3 gap-4">
              <div class="bg-primary-50 dark:bg-primary-900/10 p-4 rounded-lg">
                <p class="text-sm text-gray-600 dark:text-gray-400">THCA</p>
                <p class="text-3xl font-bold text-primary-600">{{ batch.outputs.thca.toFixed(1) }}%</p>
              </div>
              <div class="bg-success-50 dark:bg-success-900/10 p-4 rounded-lg">
                <p class="text-sm text-gray-600 dark:text-gray-400">CBDA</p>
                <p class="text-3xl font-bold text-success-600">{{ batch.outputs.cbda.toFixed(1) }}%</p>
              </div>
              <div class="bg-warning-50 dark:bg-warning-900/10 p-4 rounded-lg">
                <p class="text-sm text-gray-600 dark:text-gray-400">CBCA</p>
                <p class="text-3xl font-bold text-warning-600">{{ batch.outputs.cbca.toFixed(1) }}%</p>
              </div>
            </div>
          </div>

          @if (batch.notes) {
            <div>
              <h3 class="text-lg font-semibold mb-2">Notes</h3>
              <p class="text-gray-700 dark:text-gray-300">{{ batch.notes }}</p>
            </div>
          }
        </div>
      }
    </div>
  `
})
export class BatchDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private batchService = inject(BatchService);
  
  batch$!: Observable<Batch>;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.batch$ = this.batchService.getBatch(id);
    }
  }
}
