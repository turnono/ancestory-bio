import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { EnzymeService } from '../../../core/services/enzyme.service';
import { Enzyme } from '../../../core/models';

@Component({
  selector: 'app-enzyme-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 py-8 px-4">
      <div class="max-w-4xl mx-auto">
        <!-- Loading State -->
        <div *ngIf="isLoading" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <p class="mt-4 text-gray-600 dark:text-gray-400">Loading enzyme...</p>
        </div>

        <!-- Error State -->
        <div *ngIf="errorMessage && !isLoading" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <p class="text-red-600 dark:text-red-400">{{ errorMessage }}</p>
          <button 
            routerLink="/enzymes"
            class="mt-4 text-purple-600 dark:text-purple-400 hover:text-purple-700">
            ← Back to Enzymes
          </button>
        </div>

        <!-- Enzyme Detail -->
        <div *ngIf="enzyme && !isLoading">
          <!-- Header -->
          <div class="mb-8">
            <button 
              routerLink="/enzymes"
              class="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 mb-4 flex items-center gap-2">
              ← Back to Enzymes
            </button>
            <div class="flex items-start justify-between">
              <div>
                <h1 class="text-4xl font-bold text-gray-900 dark:text-white">{{ enzyme.name }}</h1>
                <div class="flex gap-3 mt-3">
                  <span class="px-3 py-1 rounded-full text-sm font-medium"
                        [ngClass]="{
                          'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300': enzyme.type === 'ancestral',
                          'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300': enzyme.type === 'modern',
                          'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300': enzyme.type === 'intermediate'
                        }">
                    {{ enzyme.type | titlecase }}
                  </span>
                  <span class="px-3 py-1 rounded-full text-sm font-medium"
                        [ngClass]="{
                          'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300': enzyme.specialization === 'promiscuous',
                          'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300': enzyme.specialization === 'thca',
                          'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300': enzyme.specialization === 'cbda',
                          'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300': enzyme.specialization === 'cbca'
                        }">
                    {{ enzyme.specialization | uppercase }}
                  </span>
                </div>
              </div>
              <div class="flex gap-2">
                <button 
                  [routerLink]="['/enzymes/edit', enzyme.id]"
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

          <!-- Metadata Card -->
          <div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/20 mb-6">
            <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Metadata</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Reconstruction Method -->
              <div *ngIf="enzyme.metadata?.reconstructionMethod">
                <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Reconstruction Method
                </label>
                <p class="text-gray-900 dark:text-white">{{ enzyme.metadata.reconstructionMethod }}</p>
              </div>

              <!-- Confidence Score -->
              <div *ngIf="enzyme.metadata?.confidenceScore !== undefined">
                <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Confidence Score
                </label>
                <div class="flex items-center gap-3">
                  <div class="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div class="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all"
                         [style.width.%]="(enzyme.metadata?.confidenceScore || 0) * 100"></div>
                  </div>
                  <span class="text-gray-900 dark:text-white font-medium">
                    {{ ((enzyme.metadata?.confidenceScore || 0) * 100).toFixed(0) }}%
                  </span>
                </div>
              </div>

              <!-- Description -->
              <div *ngIf="enzyme.metadata?.description" class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Description
                </label>
                <p class="text-gray-900 dark:text-white">{{ enzyme.metadata.description }}</p>
              </div>

              <!-- Sequence -->
              <div *ngIf="enzyme.metadata?.sequence" class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Amino Acid Sequence
                </label>
                <div class="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 font-mono text-sm text-gray-900 dark:text-white break-all">
                  {{ enzyme.metadata.sequence }}
                </div>
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
                <p class="text-gray-900 dark:text-white">{{ enzyme.createdAt | date:'medium' }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Last Updated
                </label>
                <p class="text-gray-900 dark:text-white">{{ enzyme.updatedAt | date:'medium' }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Delete Confirmation Modal -->
        <div *ngIf="showDeleteConfirm" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Confirm Delete</h3>
            <p class="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete <strong>{{ enzyme?.name }}</strong>? This action cannot be undone.
            </p>
            <div class="flex gap-3">
              <button 
                (click)="deleteEnzyme()"
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
export class EnzymeDetailComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private enzymeService = inject(EnzymeService);

  enzyme?: Enzyme;
  isLoading = true;
  errorMessage = '';
  showDeleteConfirm = false;
  isDeleting = false;

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.loadEnzyme(params['id']);
      }
    });
  }

  private loadEnzyme(id: string): void {
    this.isLoading = true;
    this.enzymeService.getEnzyme(id).subscribe({
      next: (enzyme) => {
        if (enzyme) {
          this.enzyme = enzyme;
        } else {
          this.errorMessage = 'Enzyme not found';
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load enzyme';
        this.isLoading = false;
      }
    });
  }

  confirmDelete(): void {
    this.showDeleteConfirm = true;
  }

  async deleteEnzyme(): Promise<void> {
    if (!this.enzyme) return;

    this.isDeleting = true;
    try {
      await this.enzymeService.deleteEnzyme(this.enzyme.id);
      this.router.navigate(['/enzymes']);
    } catch (error) {
      this.errorMessage = 'Failed to delete enzyme';
      this.isDeleting = false;
      this.showDeleteConfirm = false;
    }
  }
}
