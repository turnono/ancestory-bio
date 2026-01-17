import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { OrganismService } from '../../../core/services/organism.service';
import { Organism } from '../../../core/models';

@Component({
  selector: 'app-organism-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 py-8 px-4">
      <div class="max-w-4xl mx-auto">
        <!-- Loading State -->
        <div *ngIf="isLoading" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <p class="mt-4 text-gray-600 dark:text-gray-400">Loading organism...</p>
        </div>

        <!-- Error State -->
        <div *ngIf="errorMessage && !isLoading" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <p class="text-red-600 dark:text-red-400">{{ errorMessage }}</p>
          <button 
            routerLink="/organisms"
            class="mt-4 text-purple-600 dark:text-purple-400 hover:text-purple-700">
            ← Back to Organisms
          </button>
        </div>

        <!-- Organism Detail -->
        <div *ngIf="organism && !isLoading">
          <!-- Header -->
          <div class="mb-8">
            <button 
              routerLink="/organisms"
              class="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 mb-4 flex items-center gap-2">
              ← Back to Organisms
            </button>
            <div class="flex items-start justify-between">
              <div>
                <h1 class="text-4xl font-bold text-gray-900 dark:text-white">{{ organism.name }}</h1>
                <div class="flex gap-3 mt-3">
                  <span class="px-3 py-1 rounded-full text-sm font-medium"
                        [ngClass]="{
                          'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300': organism.type === 'yeast',
                          'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300': organism.type === 'bacteria',
                          'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300': organism.type === 'fungi'
                        }">
                    {{ organism.type | titlecase }}
                  </span>
                  <span class="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                    {{ organism.strain }}
                  </span>
                </div>
              </div>
              <div class="flex gap-2">
                <button 
                  [routerLink]="['/organisms/edit', organism.id]"
                  class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                  Edit
                </button>
                <button 
                  (click)="confirmDelete()"
                  class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                  Delete
                </button>
              </div>
            </div>
          </div>

          <!-- Taxonomy Card -->
          <div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/20 mb-6">
            <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Taxonomy</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div *ngIf="organism.taxonomy?.genus">
                <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Genus
                </label>
                <p class="text-gray-900 dark:text-white italic">{{ organism.taxonomy?.genus }}</p>
              </div>

              <div *ngIf="organism.taxonomy?.species">
                <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Species
                </label>
                <p class="text-gray-900 dark:text-white italic">{{ organism.taxonomy?.species }}</p>
              </div>
            </div>
          </div>

          <!-- Metadata Card -->
          <div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/20 mb-6">
            <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Additional Information</h2>
            
            <div class="space-y-6">
              <!-- Growth Characteristics -->
              <div *ngIf="organism.metadata?.growthCharacteristics">
                <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Growth Characteristics
                </label>
                <p class="text-gray-900 dark:text-white whitespace-pre-wrap">{{ organism.metadata?.growthCharacteristics }}</p>
              </div>

              <!-- Notes -->
              <div *ngIf="organism.metadata?.notes">
                <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Notes
                </label>
                <p class="text-gray-900 dark:text-white whitespace-pre-wrap">{{ organism.metadata?.notes }}</p>
              </div>

              <!-- Expressed Enzymes -->
              <div *ngIf="organism.expressedEnzymes && organism.expressedEnzymes.length > 0">
                <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Expressed Enzymes
                </label>
                <div class="flex flex-wrap gap-2">
                  <span *ngFor="let enzymeId of organism.expressedEnzymes"
                        class="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-full text-sm">
                    {{ enzymeId }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Files Card -->
          <div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/20 mb-6">
            <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Files & Images</h2>
            
            <div class="space-y-6">
              <!-- Genomic Files -->
              <div>
                <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Genomic Files
                </label>
                <div *ngIf="organism.genomicFiles && organism.genomicFiles.length > 0" class="space-y-2">
                  <div *ngFor="let file of organism.genomicFiles" 
                       class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                    <span class="text-gray-900 dark:text-white">{{ file.name }}</span>
                  </div>
                </div>
                <p *ngIf="!organism.genomicFiles || organism.genomicFiles.length === 0" 
                   class="text-gray-500 dark:text-gray-400 italic">
                  No genomic files uploaded
                </p>
              </div>

              <!-- Culture Images -->
              <div>
                <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Culture Images
                </label>
                <div *ngIf="organism.cultureImages && organism.cultureImages.length > 0" 
                     class="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div *ngFor="let image of organism.cultureImages" 
                       class="aspect-square bg-gray-100 dark:bg-gray-900/50 rounded-lg overflow-hidden">
                    <img [src]="image.url" [alt]="image.url" class="w-full h-full object-cover">
                  </div>
                </div>
                <p *ngIf="!organism.cultureImages || organism.cultureImages.length === 0" 
                   class="text-gray-500 dark:text-gray-400 italic">
                  No culture images uploaded
                </p>
              </div>
            </div>
          </div>

          <!-- Timestamps Card -->
          <div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/20">
            <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Timeline</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Created
                </label>
                <p class="text-gray-900 dark:text-white">{{ organism.createdAt | date:'medium' }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Last Updated
                </label>
                <p class="text-gray-900 dark:text-white">{{ organism.updatedAt | date:'medium' }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Delete Confirmation Modal -->
        <div *ngIf="showDeleteConfirm" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Confirm Delete</h3>
            <p class="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete <strong>{{ organism?.name }}</strong>? This action cannot be undone.
            </p>
            <div class="flex gap-3">
              <button 
                (click)="deleteOrganism()"
                [disabled]="isDeleting"
                class="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors">
                {{ isDeleting ? 'Deleting...' : 'Delete' }}
              </button>
              <button 
                (click)="showDeleteConfirm = false"
                [disabled]="isDeleting"
                class="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class OrganismDetailComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private organismService = inject(OrganismService);

  organism?: Organism;
  isLoading = true;
  errorMessage = '';
  showDeleteConfirm = false;
  isDeleting = false;

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.loadOrganism(params['id']);
      }
    });
  }

  private loadOrganism(id: string): void {
    this.isLoading = true;
    this.organismService.getOrganism(id).subscribe({
      next: (organism) => {
        if (organism) {
          this.organism = organism;
        } else {
          this.errorMessage = 'Organism not found';
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load organism';
        this.isLoading = false;
      }
    });
  }

  confirmDelete(): void {
    this.showDeleteConfirm = true;
  }

  async deleteOrganism(): Promise<void> {
    if (!this.organism) return;

    this.isDeleting = true;
    try {
      await this.organismService.deleteOrganism(this.organism.id);
      this.router.navigate(['/organisms']);
    } catch (error) {
      this.errorMessage = 'Failed to delete organism';
      this.isDeleting = false;
      this.showDeleteConfirm = false;
    }
  }
}
