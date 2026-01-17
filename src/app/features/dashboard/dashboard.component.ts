import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-lab-bg">
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="mb-8">
          <h2 class="text-3xl font-bold mb-2">Welcome to AncestryBio Dash</h2>
          <p class="text-gray-600 dark:text-gray-400">Specialized LIMS for biosynthetic cannabinoid production</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Yield Tracker Card -->
          <a routerLink="/yield-tracker" class="card hover:shadow-lg transition-shadow cursor-pointer">
            <div class="flex items-center mb-4">
              <div class="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <h3 class="text-lg font-semibold mb-2">Promiscuity Yield Tracker</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">Track 1-to-many cannabinoid outputs from CBGA</p>
          </a>

          <!-- Phylogenetic Tree Card -->
          <a routerLink="/phylogenetic-tree" class="card hover:shadow-lg transition-shadow cursor-pointer">
            <div class="flex items-center mb-4">
              <div class="w-12 h-12 bg-cbca-light/20 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-cbca" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
              </div>
            </div>
            <h3 class="text-lg font-semibold mb-2">Enzyme Family Tree</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">Visualize phylogenetic evolution of enzymes</p>
          </a>

          <!-- Organisms Card -->
          <a routerLink="/organisms" class="card hover:shadow-lg transition-shadow cursor-pointer">
            <div class="flex items-center mb-4">
              <div class="w-12 h-12 bg-thca-light/20 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-thca" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
            </div>
            <h3 class="text-lg font-semibold mb-2">Microbial Hosts</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">Manage organism repository and genomic data</p>
          </a>
        </div>

        <!-- Quick Stats -->
        <div class="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="card">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600 dark:text-gray-400">Total Batches</p>
                <p class="text-2xl font-bold">--</p>
              </div>
              <span class="badge badge-thca">THCA</span>
            </div>
          </div>
          <div class="card">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600 dark:text-gray-400">Active Enzymes</p>
                <p class="text-2xl font-bold">--</p>
              </div>
              <span class="badge badge-cbda">CBDA</span>
            </div>
          </div>
          <div class="card">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600 dark:text-gray-400">Organisms</p>
                <p class="text-2xl font-bold">--</p>
              </div>
              <span class="badge badge-cbca">CBCA</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  `
})
export class DashboardComponent {}
