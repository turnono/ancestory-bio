import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrganismService } from '../../../core/services/organism.service';
import { Organism } from '../../../core/models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-organism-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-gradient">Microbial Hosts</h1>
        <button routerLink="/organisms/new" class="btn btn-primary">
          <span class="text-xl mr-2">+</span>
          Add Organism
        </button>
      </div>

      @if ((organisms$ | async) && (organisms$ | async)!.length > 0) {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (organism of (organisms$ | async); track organism.id) {
            <div class="glass-card p-6 hover:shadow-lg transition-shadow cursor-pointer"
                 [routerLink]="['/organisms', organism.id]">
              <h3 class="text-xl font-bold mb-2">{{ organism.name }}</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">Type: {{ organism.type }}</p>
              <p class="text-sm">Strain: {{ organism.strain }}</p>
            </div>
          }
        </div>
      } @else {
        <div class="glass-card p-12 text-center">
          <div class="text-6xl mb-4">🦠</div>
          <h3 class="text-xl font-semibold mb-2">No organisms yet</h3>
          <p class="text-gray-600 dark:text-gray-400 mb-4">Start building your organism repository</p>
          <button routerLink="/organisms/new" class="btn btn-primary">Add First Organism</button>
        </div>
      }
    </div>
  `
})
export class OrganismListComponent implements OnInit {
  private organismService = inject(OrganismService);
  organisms$!: Observable<Organism[]>;

  ngOnInit(): void {
    this.organisms$ = this.organismService.getAllOrganisms();
  }
}
