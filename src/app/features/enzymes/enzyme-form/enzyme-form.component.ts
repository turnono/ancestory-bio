import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { EnzymeService } from '../../../core/services/enzyme.service';
import { Enzyme, EnzymeType, EnzymeSpecialization } from '../../../core/models';
import { FileUploadComponent } from '../../../shared/components/file-upload/file-upload.component';
import { UploadResult } from '../../../core/services/file-upload.service';

@Component({
  selector: 'app-enzyme-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FileUploadComponent],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 py-8 px-4">
      <div class="max-w-4xl mx-auto">
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
                  placeholder="e.g., A1A2a Ancestral CBDA Synthase"
                  class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  [class.border-red-500]="enzymeForm.get('name')?.invalid && enzymeForm.get('name')?.touched">
                <p *ngIf="enzymeForm.get('name')?.invalid && enzymeForm.get('name')?.touched" 
                   class="mt-1 text-sm text-red-600 dark:text-red-400">
                  Enzyme name is required
                </p>
              </div>

              <!-- Type & Specialization Row -->
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Enzyme Type *
                  </label>
                  <select
                    formControlName="type"
                    class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                    <option value="">Select type...</option>
                    <option value="ancestral">Ancestral</option>
                    <option value="modern">Modern</option>
                    <option value="intermediate">Intermediate</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Specialization *
                  </label>
                  <select
                    formControlName="specialization"
                    class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                    <option value="">Select specialization...</option>
                    <option value="promiscuous">Promiscuous</option>
                    <option value="thca">THCA-specific</option>
                    <option value="cbda">CBDA-specific</option>
                    <option value="cbca">CBCA-specific</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- FASTA Sequence Upload -->
            <div class="mt-8 space-y-6">
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Sequence Data</h2>
              
              <app-file-upload
                accept=".fasta,.fa,.fna,text/plain"
                [multiple]="false"
                [maxSizeMB]="5"
                storagePath="sequences"
                fileTypeLabel="FASTA files (.fasta, .fa, .fna)"
                (filesUploaded)="onFastaUploaded($event)">
              </app-file-upload>

              @if (sequencePreview) {
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Sequence Preview ({{ sequenceLength }} amino acids)
                  </label>
                  <textarea
                    [value]="sequencePreview"
                    readonly
                    rows="4"
                    class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm">
                  </textarea>
                </div>
              }
            </div>

            <!-- Kinetic Parameters -->
            <div class="mt-8 space-y-6" formGroupName="kineticParameters">
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Kinetic Parameters</h2>
              
              <div class="grid grid-cols-3 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Km (μM)
                  </label>
                  <input
                    type="number"
                    formControlName="km_uM"
                    step="0.1"
                    placeholder="12.3"
                    class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    kcat (s⁻¹)
                  </label>
                  <input
                    type="number"
                    formControlName="kcat_s"
                    step="0.1"
                    placeholder="2.1"
                    class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Catalytic Efficiency
                  </label>
                  <input
                    type="number"
                    [value]="catalyticEfficiency"
                    readonly
                    class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
                  <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Auto-calculated: kcat/Km</p>
                </div>
              </div>
            </div>

            <!-- Catalytic Residues -->
            <div class="mt-8 space-y-6">
              <div class="flex justify-between items-center">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Catalytic Residues</h2>
                <button
                  type="button"
                  (click)="addResidue()"
                  class="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300">
                  + Add Residue
                </button>
              </div>

              <div formArrayName="catalyticResidues" class="space-y-2">
                @for (residue of catalyticResidues.controls; track $index) {
                  <div class="flex gap-2">
                    <input
                      type="text"
                      [formControlName]="$index"
                      placeholder="e.g., H292"
                      class="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                    <button
                      type="button"
                      (click)="removeResidue($index)"
                      class="px-4 py-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">
                      Remove
                    </button>
                  </div>
                }
              </div>
            </div>

            <!-- Product Profile -->
            <div class="mt-8 space-y-6" formGroupName="productProfile">
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Product Profile</h2>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Primary Product
                </label>
                <select
                  formControlName="primary"
                  class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                  <option value="">Select primary product...</option>
                  <option value="THCA">Tetrahydrocannabinolic acid (THCA)</option>
                  <option value="CBDA">Cannabidiolic acid (CBDA)</option>
                  <option value="CBCA">Cannabichromenic acid (CBCA)</option>
                  <option value="CBGA">Cannabigerolic acid (CBGA)</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Secondary Products (comma-separated)
                </label>
                <input
                  type="text"
                  formControlName="secondaryInput"
                  placeholder="e.g., CBCA (trace), THCA (trace)"
                  class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Separate multiple products with commas</p>
              </div>
            </div>

            <!-- Additional Metadata -->
            <div class="mt-8 space-y-6">
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Additional Information</h2>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Reconstruction Method
                  </label>
                  <input
                    type="text"
                    formControlName="reconstructionMethod"
                    placeholder="e.g., Maximum Likelihood Phylogenetic Analysis"
                    class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                </div>

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
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Source
                </label>
                <input
                  type="text"
                  formControlName="source"
                  placeholder="e.g., Wageningen University Study (Dec 2025)"
                  class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent">
              </div>

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
  
  sequencePreview = '';
  sequenceLength = 0;
  fastaStorageUrl = '';

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
      kineticParameters: this.fb.group({
        km_uM: [null],
        kcat_s: [null]
      }),
      catalyticResidues: this.fb.array([]),
      productProfile: this.fb.group({
        primary: [''],
        secondaryInput: ['']
      }),
      reconstructionMethod: [''],
      confidenceScore: [null],
      source: [''],
      description: ['']
    });

    // Watch for kinetic parameter changes to calculate efficiency
    this.enzymeForm.get('kineticParameters')?.valueChanges.subscribe(() => {
      // Trigger recalculation
    });
  }

  get catalyticResidues(): FormArray {
    return this.enzymeForm.get('catalyticResidues') as FormArray;
  }

  get catalyticEfficiency(): string {
    const km = this.enzymeForm.get('kineticParameters.km_uM')?.value;
    const kcat = this.enzymeForm.get('kineticParameters.kcat_s')?.value;
    if (km && kcat && km > 0) {
      return (kcat / km).toFixed(3);
    }
    return '';
  }

  addResidue(): void {
    this.catalyticResidues.push(this.fb.control(''));
  }

  removeResidue(index: number): void {
    this.catalyticResidues.removeAt(index);
  }

  async onFastaUploaded(files: UploadResult[]): Promise<void> {
    if (files.length > 0) {
      const file = files[0];
      this.fastaStorageUrl = file.url;
      
      // Fetch and parse the FASTA file
      try {
        const response = await fetch(file.url);
        const content = await response.text();
        this.sequencePreview = this.enzymeService.parseFastaSequence(content);
        this.sequenceLength = this.enzymeService.calculateSequenceLength(this.sequencePreview);
      } catch (error) {
        this.errorMessage = 'Failed to parse FASTA file';
      }
    }
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
            kineticParameters: {
              km_uM: enzyme.metadata?.kineticParameters?.km_uM,
              kcat_s: enzyme.metadata?.kineticParameters?.kcat_s
            },
            productProfile: {
              primary: enzyme.metadata?.productProfile?.primary,
              secondaryInput: enzyme.metadata?.productProfile?.secondary?.join(', ')
            },
            reconstructionMethod: enzyme.metadata?.reconstructionMethod || '',
            confidenceScore: enzyme.metadata?.confidenceScore || null,
            source: enzyme.metadata?.source || '',
            description: enzyme.metadata?.description || ''
          });

          // Load catalytic residues
          if (enzyme.metadata?.catalyticResidues) {
            enzyme.metadata.catalyticResidues.forEach(residue => {
              this.catalyticResidues.push(this.fb.control(residue));
            });
          }

          // Load sequence
          if (enzyme.sequence) {
            this.sequencePreview = enzyme.sequence;
            this.sequenceLength = enzyme.sequenceLength || 0;
          }

          this.fastaStorageUrl = enzyme.metadata?.fastaStorageUrl || '';
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
    
    // Parse secondary products
    const secondaryProducts = formValue.productProfile.secondaryInput
      ? formValue.productProfile.secondaryInput.split(',').map((p: string) => p.trim()).filter((p: string) => p)
      : [];

    const enzymeData: Omit<Enzyme, 'id'> = {
      name: formValue.name,
      type: formValue.type as EnzymeType,
      specialization: formValue.specialization as EnzymeSpecialization,
      sequence: this.sequencePreview,
      sequenceLength: this.sequenceLength,
      metadata: {
        reconstructionMethod: formValue.reconstructionMethod || undefined,
        confidenceScore: formValue.confidenceScore || undefined,
        description: formValue.description || undefined,
        source: formValue.source || undefined,
        catalyticResidues: this.catalyticResidues.value.filter((r: string) => r),
        kineticParameters: {
          km_uM: formValue.kineticParameters.km_uM,
          kcat_s: formValue.kineticParameters.kcat_s,
          catalyticEfficiency: this.catalyticEfficiency ? parseFloat(this.catalyticEfficiency) : undefined
        },
        productProfile: {
          primary: formValue.productProfile.primary || undefined,
          secondary: secondaryProducts.length > 0 ? secondaryProducts : undefined
        },
        fastaStorageUrl: this.fastaStorageUrl || undefined
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
