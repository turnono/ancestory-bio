import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { OrganismService } from '../../../core/services/organism.service';
import { Organism, OrganismType } from '../../../core/models';

@Component({
  selector: 'app-organism-form',
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
            ← Back to Organisms
          </button>
          <h1 class="text-4xl font-bold text-gray-900 dark:text-white">
            {{ isEditMode ? 'Edit Organism' : 'Add New Organism' }}
          </h1>
          <p class="text-gray-600 dark:text-gray-400 mt-2">
            {{ isEditMode ? 'Update organism information' : 'Add a new organism to the repository' }}
          </p>
        </div>

        <!-- Form Card -->
        <div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/20">
          <form [formGroup]="organismForm" (ngSubmit)="onSubmit()">
            <!-- Basic Information -->
            <div class="space-y-6">
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Basic Information</h2>

              <!-- Name -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Organism Name *
                </label>
                <input
                  type="text"
                  formControlName="name"
                  placeholder="e.g., Saccharomyces cerevisiae CEN.PK"
                  class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  [class.border-red-500]="organismForm.get('name')?.invalid && organismForm.get('name')?.touched">
                <p *ngIf="organismForm.get('name')?.invalid && organismForm.get('name')?.touched" 
                   class="mt-1 text-sm text-red-600 dark:text-red-400">
                  Organism name is required
                </p>
              </div>

              <!-- Type -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Organism Type *
                </label>
                <select
                  formControlName="type"
                  class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  [class.border-red-500]="organismForm.get('type')?.invalid && organismForm.get('type')?.touched">
                  <option value="">Select type...</option>
                  <option value="yeast">Yeast</option>
                  <option value="bacteria">Bacteria</option>
                  <option value="fungi">Fungi</option>
                </select>
                <p *ngIf="organismForm.get('type')?.invalid && organismForm.get('type')?.touched" 
                   class="mt-1 text-sm text-red-600 dark:text-red-400">
                  Organism type is required
                </p>
              </div>

              <!-- Strain -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Strain *
                </label>
                <input
                  type="text"
                  formControlName="strain"
                  placeholder="e.g., CEN.PK113-7D"
                  class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  [class.border-red-500]="organismForm.get('strain')?.invalid && organismForm.get('strain')?.touched">
                <p *ngIf="organismForm.get('strain')?.invalid && organismForm.get('strain')?.touched" 
                   class="mt-1 text-sm text-red-600 dark:text-red-400">
                  Strain is required
                </p>
              </div>
            </div>

            <!-- Taxonomy -->
            <div class="mt-8 space-y-6">
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Taxonomy</h2>

              <!-- Genus -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Genus
                </label>
                <input
                  type="text"
                  formControlName="genus"
                  placeholder="e.g., Saccharomyces"
                  class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent">
              </div>

              <!-- Species -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Species
                </label>
                <input
                  type="text"
                  formControlName="species"
                  placeholder="e.g., cerevisiae"
                  class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent">
              </div>
            </div>

            <!-- Additional Information -->
            <div class="mt-8 space-y-6">
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Additional Information</h2>

              <!-- Growth Characteristics -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Growth Characteristics
                </label>
                <textarea
                  formControlName="growthCharacteristics"
                  rows="3"
                  placeholder="Describe growth conditions, temperature, media, etc..."
                  class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"></textarea>
              </div>

              <!-- Notes -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Notes
                </label>
                <textarea
                  formControlName="notes"
                  rows="3"
                  placeholder="Additional notes..."
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
                [disabled]="organismForm.invalid || isLoading"
                class="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                <span *ngIf="!isLoading">{{ isEditMode ? 'Update Organism' : 'Create Organism' }}</span>
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
export class OrganismFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private organismService = inject(OrganismService);

  organismForm!: FormGroup;
  isEditMode = false;
  organismId?: string;
  isLoading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.initializeForm();
    
    // Check if we're in edit mode
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.organismId = params['id'];
        this.loadOrganism(params['id']);
      }
    });
  }

  private initializeForm(): void {
    this.organismForm = this.fb.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
      strain: ['', Validators.required],
      genus: [''],
      species: [''],
      growthCharacteristics: [''],
      notes: ['']
    });
  }

  private loadOrganism(id: string): void {
    this.isLoading = true;
    this.organismService.getOrganism(id).subscribe({
      next: (organism) => {
        if (organism) {
          this.organismForm.patchValue({
            name: organism.name,
            type: organism.type,
            strain: organism.strain,
            genus: organism.taxonomy?.genus || '',
            species: organism.taxonomy?.species || '',
            growthCharacteristics: organism.metadata?.growthCharacteristics || '',
            notes: organism.metadata?.notes || ''
          });
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load organism data';
        this.isLoading = false;
      }
    });
  }

  async onSubmit(): Promise<void> {
    if (this.organismForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    const formValue = this.organismForm.value;
    const organismData: Omit<Organism, 'id'> = {
      name: formValue.name,
      type: formValue.type as OrganismType,
      strain: formValue.strain,
      taxonomy: {
        genus: formValue.genus || undefined,
        species: formValue.species || undefined
      },
      metadata: {
        growthCharacteristics: formValue.growthCharacteristics || undefined,
        notes: formValue.notes || undefined
      },
      expressedEnzymes: [],
      genomicFiles: [],
      cultureImages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    try {
      if (this.isEditMode && this.organismId) {
        await this.organismService.updateOrganism(this.organismId, organismData);
      } else {
        await this.organismService.createOrganism(organismData);
      }
      this.router.navigate(['/organisms']);
    } catch (error: any) {
      this.isLoading = false;
      this.errorMessage = error.message || `Failed to ${this.isEditMode ? 'update' : 'create'} organism`;
    }
  }

  goBack(): void {
    this.router.navigate(['/organisms']);
  }
}
