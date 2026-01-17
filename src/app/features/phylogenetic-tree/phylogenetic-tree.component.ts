import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-phylogenetic-tree',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-gradient">Enzyme Family Tree</h1>
      <p class="text-gray-600 dark:text-gray-400 mt-2 mb-8">
        Visualize phylogenetic evolution of enzymes
      </p>
      
      <div class="glass-card p-12 text-center">
        <div class="text-6xl mb-4">🌳</div>
        <h3 class="text-xl font-semibold mb-2">Phylogenetic Tree Visualization</h3>
        <p class="text-gray-600 dark:text-gray-400 mb-4">
          Interactive D3.js tree visualization coming soon
        </p>
        <button routerLink="/dashboard" class="btn btn-secondary">Back to Dashboard</button>
      </div>
    </div>
  `
})
export class PhylogeneticTreeComponent {}
