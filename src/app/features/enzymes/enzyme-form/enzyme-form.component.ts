import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-enzyme-form',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold">Add Enzyme</h1>
      <p class="text-gray-600 mt-2">Coming soon...</p>
      <button routerLink="/enzymes" class="btn btn-secondary mt-4">Back to Enzymes</button>
    </div>
  `
})
export class EnzymeFormComponent {}
