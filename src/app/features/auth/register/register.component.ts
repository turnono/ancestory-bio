import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { UserRole } from '../../../core/models';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 dark:from-lab-bg dark:to-gray-900 px-4">
      <div class="glass-card p-8 w-full max-w-md animate-fade-in">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gradient mb-2">Create Account</h1>
          <p class="text-gray-600 dark:text-gray-400">Join AncestryBio Dash</p>
        </div>

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-6">
          @if (errorMessage) {
            <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
              <p class="text-sm text-red-800 dark:text-red-200">{{ errorMessage }}</p>
            </div>
          }

          <div>
            <label for="displayName" class="block text-sm font-medium mb-2">Full Name</label>
            <input
              id="displayName"
              type="text"
              formControlName="displayName"
              class="input"
              placeholder="Dr. Jane Smith"
            />
          </div>

          <div>
            <label for="email" class="block text-sm font-medium mb-2">Email</label>
            <input
              id="email"
              type="email"
              formControlName="email"
              class="input"
              placeholder="jane@ancestrybio.com"
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium mb-2">Password</label>
            <input
              id="password"
              type="password"
              formControlName="password"
              class="input"
              placeholder="••••••••"
            />
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Minimum 6 characters</p>
          </div>

          <div>
            <label for="role" class="block text-sm font-medium mb-2">Role</label>
            <select
              id="role"
              formControlName="role"
              class="input"
            >
              <option [value]="UserRole.LAB_TECH">Lab Technician</option>
              <option [value]="UserRole.RESEARCHER">Researcher</option>
              <option [value]="UserRole.ADMIN">Administrator</option>
            </select>
          </div>

          <button
            type="submit"
            [disabled]="registerForm.invalid || isLoading"
            class="btn btn-primary w-full"
          >
            @if (isLoading) {
              <span class="spinner mr-2"></span>
            }
            Create Account
          </button>
        </form>

        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Already have an account?
            <a routerLink="/auth/login" class="text-primary-600 hover:text-primary-700 font-medium">
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  UserRole = UserRole;
  isLoading = false;
  errorMessage = '';

  registerForm = this.fb.group({
    displayName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    role: [UserRole.LAB_TECH, [Validators.required]]
  });

  onSubmit(): void {
    if (this.registerForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    const { email, password, displayName, role } = this.registerForm.value;

    this.authService.register(email!, password!, displayName!, role!).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Registration error:', error);
        this.errorMessage = this.getErrorMessage(error.code);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  private getErrorMessage(code: string): string {
    switch (code) {
      case 'auth/email-already-in-use':
        return 'This email is already registered';
      case 'auth/weak-password':
        return 'Password is too weak';
      default:
        return 'An error occurred. Please try again';
    }
  }
}
