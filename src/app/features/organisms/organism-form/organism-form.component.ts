import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-organism-form',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold">Add Organism</h1>
      <p class="text-gray-600 mt-2">Coming soon...</p>
      <button routerLink="/organisms" class="btn btn-secondary mt-4">Back to Organisms</button>
    </div>
  `
})
export class OrganismFormComponent {}
