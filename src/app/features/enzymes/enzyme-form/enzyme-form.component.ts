import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { EnzymeService } from '../../../core/services/enzyme.service';
import { Enzyme, EnzymeType, EnzymeSpecialization } from '../../../core/models';

@Component({
  selector: 'app-enzyme-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 py-8 px-4">
      <div class="max-w-3xl mx-auto">
        <!-- Header -->
        <div class="mb-8">
          <button 
            (click)="goBack()"
            class="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 mb-4 flex items-center gap-2">
            ← Back to Enzymes
          </button>
          <h1 class="text-4xl font-bold text-gray-900 dark:text-white">
            {{ isEditMode ? 'Edit Enzyme' : 'Add New Enzyme' }}
          </h1>
          <p class="text-gray-600 dark:text-gray-400 mt-2">
            {{ isEditMode ? 'Update enzyme information' : 'Add a new enzyme to the catalog' }}
          </p>
        </div>

        <!-- Form Card -->
        <div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/20">
          <form [formGroup]="enzymeForm" (ngSubmit)="onSubmit()">
            <!-- Basic Information -->
            <div class="space-y-6">
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Basic Information</h2>

              <!-- Name -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Enzyme Name *
                </label>
                <input
                  type="text"
                  formControlName="name"
                  placeholder="e.g., CBGA Synthase Alpha"
                  class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  [class.border-red-500]="enzymeForm.get('name')?.invalid && enzymeForm.get('name')?.touched">
                <p *ngIf="enzymeForm.get('name')?.invalid && enzymeForm.get('name')?.touched" 
                   class="mt-1 text-sm text-red-600 dark:text-red-400">
                  Enzyme name is required
                </p>
              </div>

              <!-- Type -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Enzyme Type *
                </label>
                <select
                  formControlName="type"
                  class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  [class.border-red-500]="enzymeForm.get('type')?.invalid && enzymeForm.get('type')?.touched">
                  <option value="">Select type...</option>
                  <option value="ancestral">Ancestral</option>
                  <option value="modern">Modern</option>
                  <option value="intermediate">Intermediate</option>
                </select>
                <p *ngIf="enzymeForm.get('type')?.invalid && enzymeForm.get('type')?.touched" 
                   class="mt-1 text-sm text-red-600 dark:text-red-400">
                  Enzyme type is required
                </p>
              </div>

              <!-- Specialization -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Specialization *
                </label>
                <select
                  formControlName="specialization"
                  class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  [class.border-red-500]="enzymeForm.get('specialization')?.invalid && enzymeForm.get('specialization')?.touched">
                  <option value="">Select specialization...</option>
                  <option value="promiscuous">Promiscuous</option>
                  <option value="thca">THCA-specific</option>
                  <option value="cbda">CBDA-specific</option>
                  <option value="cbca">CBCA-specific</option>
                </select>
                <p *ngIf="enzymeForm.get('specialization')?.invalid && enzymeForm.get('specialization')?.touched" 
                   class="mt-1 text-sm text-red-600 dark:text-red-400">
                  Specialization is required
                </p>
              </div>
            </div>

            <!-- Metadata -->
            <div class="mt-8 space-y-6">
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Metadata</h2>

              <!-- Sequence -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Sequence
                </label>
                <textarea
                  formControlName="sequence"
                  rows="4"
                  placeholder="Enter amino acid sequence..."
                  class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-sm"></textarea>
              </div>

              <!-- Reconstruction Method -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Reconstruction Method
                </label>
                <input
                  type="text"
                  formControlName="reconstructionMethod"
                  placeholder="e.g., Maximum Likelihood, Direct Sequencing"
                  class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent">
              </div>

              <!-- Confidence Score -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Confidence Score (0-1)
                </label>
                <input
                  type="number"
                  formControlName="confidenceScore"
                  step="0.01"
                  min="0"
                  max="1"
                  placeholder="0.95"
                  class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent">
              </div>

              <!-- Description -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  formControlName="description"
                  rows="3"
                  placeholder="Enter enzyme description..."
                  class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"></textarea>
              </div>
            </div>

            <!-- Error Message -->
            <div *ngIf="errorMessage" class="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p class="text-red-600 dark:text-red-400">{{ errorMessage }}</p>
            </div>

            <!-- Actions -->
            <div class="mt-8 flex gap-4">
              <button
                type="submit"
                [disabled]="enzymeForm.invalid || isLoading"
                class="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                <span *ngIf="!isLoading">{{ isEditMode ? 'Update Enzyme' : 'Create Enzyme' }}</span>
                <span *ngIf="isLoading">{{ isEditMode ? 'Updating...' : 'Creating...' }}</span>
              </button>
              <button
                type="button"
                (click)="goBack()"
                class="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class EnzymeFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private enzymeService = inject(EnzymeService);

  enzymeForm!: FormGroup;
  isEditMode = false;
  enzymeId?: string;
  isLoading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.initializeForm();
    
    // Check if we're in edit mode
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.enzymeId = params['id'];
        this.loadEnzyme(params['id']);
      }
    });
  }

  private initializeForm(): void {
    this.enzymeForm = this.fb.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
      specialization: ['', Validators.required],
      sequence: [''],
      reconstructionMethod: [''],
      confidenceScore: [null],
      description: ['']
    });
  }

  private loadEnzyme(id: string): void {
    this.isLoading = true;
    this.enzymeService.getEnzyme(id).subscribe({
      next: (enzyme) => {
        if (enzyme) {
          this.enzymeForm.patchValue({
            name: enzyme.name,
            type: enzyme.type,
            specialization: enzyme.specialization,
            sequence: enzyme.metadata?.sequence || '',
            reconstructionMethod: enzyme.metadata?.reconstructionMethod || '',
            confidenceScore: enzyme.metadata?.confidenceScore || null,
            description: enzyme.metadata?.description || ''
          });
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load enzyme data';
        this.isLoading = false;
      }
    });
  }

  async onSubmit(): Promise<void> {
    if (this.enzymeForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    const formValue = this.enzymeForm.value;
    const enzymeData: Omit<Enzyme, 'id'> = {
      name: formValue.name,
      type: formValue.type as EnzymeType,
      specialization: formValue.specialization as EnzymeSpecialization,
      metadata: {
        sequence: formValue.sequence || undefined,
        reconstructionMethod: formValue.reconstructionMethod || undefined,
        confidenceScore: formValue.confidenceScore || undefined,
        description: formValue.description || undefined
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    try {
      if (this.isEditMode && this.enzymeId) {
        await this.enzymeService.updateEnzyme(this.enzymeId, enzymeData);
      } else {
        await this.enzymeService.createEnzyme(enzymeData);
      }
      this.router.navigate(['/enzymes']);
    } catch (error: any) {
      this.isLoading = false;
      this.errorMessage = error.message || `Failed to ${this.isEditMode ? 'update' : 'create'} enzyme`;
    }
  }

  goBack(): void {
    this.router.navigate(['/enzymes']);
  }
}
