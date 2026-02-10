import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { OrganismService } from '../../../core/services/organism.service';
import { Organism, OrganismType, GenomicFile, CultureImage } from '../../../core/models';
import { FileUploadComponent } from '../../../shared/components/file-upload/file-upload.component';
import { UploadResult } from '../../../core/services/file-upload.service';

@Component({
  selector: 'app-organism-form',
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
                  placeholder="e.g., Saccharomyces cerevisiae CEN.PK113-7D"
                  class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  [class.border-red-500]="organismForm.get('name')?.invalid && organismForm.get('name')?.touched">
                <p *ngIf="organismForm.get('name')?.invalid && organismForm.get('name')?.touched" 
                   class="mt-1 text-sm text-red-600 dark:text-red-400">
                  Organism name is required
                </p>
              </div>

              <!-- Type & Strain Row -->
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Organism Type *
                  </label>
                  <select
                    formControlName="type"
                    class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                    <option value="">Select type...</option>
                    <option value="yeast">Yeast</option>
                    <option value="bacteria">Bacteria</option>
                    <option value="fungi">Fungi</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Strain *
                  </label>
                  <input
                    type="text"
                    formControlName="strain"
                    placeholder="e.g., CEN.PK113-7D"
                    class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                </div>
              </div>
            </div>

            <!-- Full Taxonomy -->
            <div class="mt-8 space-y-6" formGroupName="taxonomy">
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Taxonomy (Linnaean Classification)</h2>
              
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Kingdom
                  </label>
                  <input
                    type="text"
                    formControlName="kingdom"
                    placeholder="e.g., Fungi"
                    class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phylum
                  </label>
                  <input
                    type="text"
                    formControlName="phylum"
                    placeholder="e.g., Ascomycota"
                    class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Class
                  </label>
                  <input
                    type="text"
                    formControlName="class"
                    placeholder="e.g., Saccharomycetes"
                    class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Order
                  </label>
                  <input
                    type="text"
                    formControlName="order"
                    placeholder="e.g., Saccharomycetales"
                    class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Family
                  </label>
                  <input
                    type="text"
                    formControlName="family"
                    placeholder="e.g., Saccharomycetaceae"
                    class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                </div>

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
            </div>

            <!-- Growth Characteristics -->
            <div class="mt-8 space-y-6" formGroupName="metadata">
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Growth Characteristics</h2>
              
              <div class="grid grid-cols-3 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Growth Temperature
                  </label>
                  <input
                    type="text"
                    formControlName="growthTemp"
                    placeholder="e.g., 30°C"
                    class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Optimal pH
                  </label>
                  <input
                    type="number"
                    formControlName="optimalPh"
                    step="0.1"
                    placeholder="5.5"
                    class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Doubling Time
                  </label>
                  <input
                    type="text"
                    formControlName="doublingTime"
                    placeholder="e.g., 90 min"
                    class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Growth Characteristics
                </label>
                <textarea
                  formControlName="growthCharacteristics"
                  rows="3"
                  placeholder="Describe growth conditions, media requirements, etc..."
                  class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"></textarea>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Applications (comma-separated)
                </label>
                <input
                  type="text"
                  formControlName="applicationsInput"
                  placeholder="e.g., Heterologous protein expression, Cannabinoid biosynthesis"
                  class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Separate multiple applications with commas</p>
              </div>

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

            <!-- Genomic Files -->
            <div class="mt-8 space-y-6">
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Genomic Files</h2>
              
              <app-file-upload
                accept=".fasta,.fa,.fna,.gb,.gff,text/plain"
                [multiple]="true"
                [maxSizeMB]="10"
                storagePath="genomic-files"
                fileTypeLabel="Genomic files (.fasta, .gb, .gff)"
                (filesUploaded)="onGenomicFilesUploaded($event)">
              </app-file-upload>

              @if (genomicFiles.length > 0) {
                <div class="space-y-2">
                  <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">Uploaded Files ({{ genomicFiles.length }})</h3>
                  @for (file of genomicFiles; track file.id) {
                    <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ file.name }}</p>
                        <p class="text-xs text-gray-500 dark:text-gray-400">{{ formatFileSize(file.size) }}</p>
                      </div>
                      <button
                        type="button"
                        (click)="removeGenomicFile(file)"
                        class="ml-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">
                        Remove
                      </button>
                    </div>
                  }
                </div>
              }
            </div>

            <!-- Culture Images -->
            <div class="mt-8 space-y-6">
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Culture Images</h2>
              
              <app-file-upload
                accept=".jpg,.jpeg,.png,.webp,image/*"
                [multiple]="true"
                [maxSizeMB]="5"
                storagePath="culture-images"
                fileTypeLabel="Image files (.jpg, .png, .webp)"
                (filesUploaded)="onCultureImagesUploaded($event)">
              </app-file-upload>

              @if (cultureImages.length > 0) {
                <div class="grid grid-cols-3 gap-4">
                  @for (image of cultureImages; track image.id) {
                    <div class="relative group">
                      <img [src]="image.url" [alt]="image.description" class="w-full h-32 object-cover rounded-lg">
                      <button
                        type="button"
                        (click)="removeCultureImage(image)"
                        class="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        ✕
                      </button>
                    </div>
                  }
                </div>
              }
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
  
  genomicFiles: GenomicFile[] = [];
  cultureImages: CultureImage[] = [];

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
      taxonomy: this.fb.group({
        kingdom: [''],
        phylum: [''],
        class: [''],
        order: [''],
        family: [''],
        genus: [''],
        species: ['']
      }),
      metadata: this.fb.group({
        growthTemp: [''],
        optimalPh: [null],
        doublingTime: [''],
        growthCharacteristics: [''],
        applicationsInput: [''],
        notes: ['']
      })
    });
  }

  async onGenomicFilesUploaded(files: UploadResult[]): Promise<void> {
    const byId = new Map(this.genomicFiles.map(file => [file.id, file]));

    for (const file of files) {
      byId.set(file.path, {
        id: file.path,
        name: file.name,
        fastaUrl: file.url,
        uploadDate: new Date(),
        size: file.size
      });
    }

    this.genomicFiles = Array.from(byId.values());
  }

  async onCultureImagesUploaded(files: UploadResult[]): Promise<void> {
    const byId = new Map(this.cultureImages.map(image => [image.id, image]));

    for (const file of files) {
      byId.set(file.path, {
        id: file.path,
        url: file.url,
        uploadDate: new Date(),
        description: '',
        thumbnailUrl: file.url
      });
    }

    this.cultureImages = Array.from(byId.values());
  }

  removeGenomicFile(file: GenomicFile): void {
    this.genomicFiles = this.genomicFiles.filter(f => f.id !== file.id);
  }

  removeCultureImage(image: CultureImage): void {
    this.cultureImages = this.cultureImages.filter(i => i.id !== image.id);
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
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
            taxonomy: {
              kingdom: organism.taxonomy?.kingdom || '',
              phylum: organism.taxonomy?.phylum || '',
              class: organism.taxonomy?.class || '',
              order: organism.taxonomy?.order || '',
              family: organism.taxonomy?.family || '',
              genus: organism.taxonomy?.genus || '',
              species: organism.taxonomy?.species || ''
            },
            metadata: {
              growthTemp: organism.metadata?.growthTemp || '',
              optimalPh: organism.metadata?.optimalPh || null,
              doublingTime: organism.metadata?.doublingTime || '',
              growthCharacteristics: organism.metadata?.growthCharacteristics || '',
              applicationsInput: organism.metadata?.applications?.join(', ') || '',
              notes: organism.metadata?.notes || ''
            }
          });

          // Load existing files and images
          this.genomicFiles = organism.genomicFiles || [];
          this.cultureImages = organism.cultureImages || [];
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
    
    // Parse applications
    const applications = formValue.metadata.applicationsInput
      ? formValue.metadata.applicationsInput.split(',').map((a: string) => a.trim()).filter((a: string) => a)
      : [];

    const organismData: Omit<Organism, 'id'> = {
      name: formValue.name,
      type: formValue.type as OrganismType,
      strain: formValue.strain,
      taxonomy: {
        kingdom: formValue.taxonomy.kingdom || undefined,
        phylum: formValue.taxonomy.phylum || undefined,
        class: formValue.taxonomy.class || undefined,
        order: formValue.taxonomy.order || undefined,
        family: formValue.taxonomy.family || undefined,
        genus: formValue.taxonomy.genus || undefined,
        species: formValue.taxonomy.species || undefined
      },
      metadata: {
        growthTemp: formValue.metadata.growthTemp || undefined,
        optimalPh: formValue.metadata.optimalPh || undefined,
        doublingTime: formValue.metadata.doublingTime || undefined,
        growthCharacteristics: formValue.metadata.growthCharacteristics || undefined,
        applications: applications.length > 0 ? applications : undefined,
        notes: formValue.metadata.notes || undefined
      },
      genomicFiles: this.genomicFiles,
      cultureImages: this.cultureImages,
      expressedEnzymes: [],
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
