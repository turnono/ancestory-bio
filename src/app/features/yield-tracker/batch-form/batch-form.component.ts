import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { BatchService } from '../../../core/services/batch.service';
import { EnzymeService } from '../../../core/services/enzyme.service';
import { OrganismService } from '../../../core/services/organism.service';
import { AuthService } from '../../../core/services/auth.service';
import { Enzyme, Organism, User } from '../../../core/models/index';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-batch-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="container mx-auto px-4 py-8 max-w-3xl">
      <div class="mb-8">
        <button routerLink="/yield-tracker" class="text-primary-600 hover:text-primary-700 mb-4">
          ← Back to Yield Tracker
        </button>
        <h1 class="text-3xl font-bold text-gradient">New Batch</h1>
        <p class="text-gray-600 dark:text-gray-400 mt-2">
          Record a new cannabinoid yield experiment
        </p>
      </div>

      <form [formGroup]="batchForm" (ngSubmit)="onSubmit()" class="glass-card p-8">
        @if (errorMessage) {
          <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3 mb-6">
            <p class="text-sm text-red-800 dark:text-red-200">{{ errorMessage }}</p>
          </div>
        }

        <!-- Enzyme Selection -->
        <div class="mb-6">
          <label for="enzymeId" class="block text-sm font-medium mb-2">Enzyme *</label>
          <select
            id="enzymeId"
            formControlName="enzymeId"
            class="input"
          >
            <option value="">Select an enzyme</option>
            @for (enzyme of (enzymes$ | async); track enzyme.id) {
              <option [value]="enzyme.id">
                {{ enzyme.name }} ({{ enzyme.type }})
              </option>
            }
          </select>
          @if (!hasEnzymes) {
            <p class="text-sm text-gray-500 mt-1">
              No enzymes available. <a routerLink="/enzymes/new" class="text-primary-600 hover:underline">Create one first</a>
            </p>
          }
        </div>

        <!-- CBGA Input -->
        <div class="mb-6">
          <label for="cbgaInput" class="block text-sm font-medium mb-2">CBGA Input (mg) *</label>
          <input
            id="cbgaInput"
            type="number"
            formControlName="cbgaInput"
            class="input"
            placeholder="100"
            min="0"
            step="0.1"
          />
        </div>

        <!-- Cannabinoid Outputs -->
        <div class="mb-6">
          <label class="block text-sm font-medium mb-3">Cannabinoid Outputs (%) *</label>
          <div class="grid grid-cols-3 gap-4">
            <div>
              <label for="thca" class="block text-xs text-gray-600 dark:text-gray-400 mb-1">THCA</label>
              <input
                id="thca"
                type="number"
                formControlName="thca"
                class="input"
                placeholder="33.3"
                min="0"
                max="100"
                step="0.1"
              />
            </div>
            <div>
              <label for="cbda" class="block text-xs text-gray-600 dark:text-gray-400 mb-1">CBDA</label>
              <input
                id="cbda"
                type="number"
                formControlName="cbda"
                class="input"
                placeholder="33.3"
                min="0"
                max="100"
                step="0.1"
              />
            </div>
            <div>
              <label for="cbca" class="block text-xs text-gray-600 dark:text-gray-400 mb-1">CBCA</label>
              <input
                id="cbca"
                type="number"
                formControlName="cbca"
                class="input"
                placeholder="33.3"
                min="0"
                max="100"
                step="0.1"
              />
            </div>
          </div>
          <p class="text-xs text-gray-500 mt-2">
            Total: {{ getOutputTotal() }}% (should be ~100%)
          </p>
        </div>

        <!-- Notes -->
        <div class="mb-6">
          <label for="notes" class="block text-sm font-medium mb-2">Notes (optional)</label>
          <textarea
            id="notes"
            formControlName="notes"
            class="input"
            rows="4"
            placeholder="Add any observations or notes about this batch..."
          ></textarea>
        </div>

        <!-- Form Actions -->
        <div class="flex gap-4">
          <button
            type="submit"
            [disabled]="batchForm.invalid || isLoading"
            class="btn btn-primary flex-1"
          >
            @if (isLoading) {
              <span class="spinner mr-2"></span>
            }
            Create Batch
          </button>
          <button
            type="button"
            routerLink="/yield-tracker"
            class="btn btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  `
})
export class BatchFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private batchService = inject(BatchService);
  private enzymeService = inject(EnzymeService);
  private authService = inject(AuthService);
  private router = inject(Router);

  enzymes$!: Observable<Enzyme[]>;
  hasEnzymes = false;
  isLoading = false;
  errorMessage = '';
  currentUser: User | null = null;

  batchForm = this.fb.group({
    enzymeId: ['', [Validators.required]],
    cbgaInput: [0, [Validators.required, Validators.min(0)]],
    thca: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
    cbda: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
    cbca: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
    notes: ['']
  });

  ngOnInit(): void {
    this.enzymes$ = this.enzymeService.getAllEnzymes();
    this.enzymes$.subscribe(enzymes => {
      this.hasEnzymes = enzymes.length > 0;
    });

    this.authService.userProfile$.subscribe(user => {
      this.currentUser = user;
    });
  }

  getOutputTotal(): number {
    const thca = this.batchForm.get('thca')?.value || 0;
    const cbda = this.batchForm.get('cbda')?.value || 0;
    const cbca = this.batchForm.get('cbca')?.value || 0;
    return Number((thca + cbda + cbca).toFixed(1));
  }

  async onSubmit(): Promise<void> {
    if (this.batchForm.invalid || !this.currentUser) return;

    this.isLoading = true;
    this.errorMessage = '';

    const { enzymeId, cbgaInput, thca, cbda, cbca, notes } = this.batchForm.value;

    try {
      // Get enzyme name
      const enzyme = await this.enzymeService.getEnzyme(enzymeId!).toPromise();
      if (!enzyme) throw new Error('Enzyme not found');

      await this.batchService.createBatch(
        enzymeId!,
        cbgaInput!,
        { thca: thca!, cbda: cbda!, cbca: cbca! },
        this.currentUser.uid,
        this.currentUser.displayName,
        enzyme.name,
        notes || undefined
      );

      this.router.navigate(['/yield-tracker']);
    } catch (error: any) {
      this.isLoading = false;
      this.errorMessage = error.message || 'Failed to create batch. Please try again.';
    }
  }
}
