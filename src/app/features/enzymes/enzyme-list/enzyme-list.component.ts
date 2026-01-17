import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EnzymeService } from '../../../core/services/enzyme.service';
import { Enzyme } from '../../../core/models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-enzyme-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-gradient">Enzyme Catalog</h1>
        <button routerLink="/enzymes/new" class="btn btn-primary">
          <span class="text-xl mr-2">+</span>
          Add Enzyme
        </button>
      </div>

      @if ((enzymes$ | async) && (enzymes$ | async)!.length > 0) {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (enzyme of (enzymes$ | async); track enzyme.id) {
            <div class="glass-card p-6 hover:shadow-lg transition-shadow cursor-pointer"
                 [routerLink]="['/enzymes', enzyme.id]">
              <h3 class="text-xl font-bold mb-2">{{ enzyme.name }}</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">Type: {{ enzyme.type }}</p>
              <p class="text-sm">Specialization: {{ enzyme.specialization }}</p>
            </div>
          }
        </div>
      } @else {
        <div class="glass-card p-12 text-center">
          <div class="text-6xl mb-4">🧬</div>
          <h3 class="text-xl font-semibold mb-2">No enzymes yet</h3>
          <p class="text-gray-600 dark:text-gray-400 mb-4">Start building your enzyme catalog</p>
          <button routerLink="/enzymes/new" class="btn btn-primary">Add First Enzyme</button>
        </div>
      }
    </div>
  `
})
export class EnzymeListComponent implements OnInit {
  private enzymeService = inject(EnzymeService);
  enzymes$!: Observable<Enzyme[]>;

  ngOnInit(): void {
    this.enzymes$ = this.enzymeService.getAllEnzymes();
  }
}
