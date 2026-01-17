import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, RouterModule } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { User } from './core/models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-lab-bg">
      <!-- Global Navigation Header -->
      <nav class="bg-white dark:bg-lab-surface border-b border-gray-200 dark:border-lab-border sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex items-center space-x-8">
              <h1 class="text-xl font-bold text-gradient">AncestryBio Dash</h1>
              <div class="hidden md:flex items-center space-x-4">
                <a routerLink="/dashboard" routerLinkActive="text-primary-600" [routerLinkActiveOptions]="{exact: true}" class="text-gray-700 dark:text-gray-300 hover:text-primary-600 transition-colors">
                  Dashboard
                </a>
                <a routerLink="/yield-tracker" routerLinkActive="text-primary-600" class="text-gray-700 dark:text-gray-300 hover:text-primary-600 transition-colors">
                  Yield Tracker
                </a>
                <a routerLink="/enzymes" routerLinkActive="text-primary-600" class="text-gray-700 dark:text-gray-300 hover:text-primary-600 transition-colors">
                  Enzymes
                </a>
                <a routerLink="/organisms" routerLinkActive="text-primary-600" class="text-gray-700 dark:text-gray-300 hover:text-primary-600 transition-colors">
                  Organisms
                </a>
                <a routerLink="/phylogenetic-tree" routerLinkActive="text-primary-600" class="text-gray-700 dark:text-gray-300 hover:text-primary-600 transition-colors">
                  Phylogenetic Tree
                </a>
              </div>
            </div>
            
            <!-- User Menu -->
            @if (user$ | async; as user) {
              <div class="flex items-center space-x-4">
                <div class="text-sm text-gray-700 dark:text-gray-300">
                  <span class="font-medium">{{ user.displayName }}</span>
                  <span class="text-xs text-gray-500 dark:text-gray-400 ml-2">({{ user.role }})</span>
                </div>
                <button
                  (click)="signOut()"
                  class="text-sm text-gray-700 dark:text-gray-300 hover:text-primary-600 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            }
          </div>
        </div>
      </nav>
      
      <!-- Main Content -->
      <router-outlet></router-outlet>
    </div>
  `,
  styles: []
})
export class AppComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  
  user$: Observable<User | null> = this.authService.userProfile$;

  signOut(): void {
    this.authService.signOut().subscribe(() => {
      this.router.navigate(['/auth/login']);
    });
  }
}
