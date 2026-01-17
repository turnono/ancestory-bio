import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 dark:from-lab-bg dark:to-gray-900 px-4">
      <div class="glass-card p-8 w-full max-w-md animate-fade-in">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gradient mb-2">AncestryBio Dash</h1>
          <p class="text-gray-600 dark:text-gray-400">Biosynthetic Cannabinoid Production LIMS</p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-6">
          @if (errorMessage) {
            <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
              <p class="text-sm text-red-800 dark:text-red-200">{{ errorMessage }}</p>
            </div>
          }

          <div>
            <label for="email" class="block text-sm font-medium mb-2">Email</label>
            <input
              id="email"
              type="email"
              formControlName="email"
              class="input"
              placeholder="lab@ancestrybio.com"
            />
            @if (loginForm.get('email')?.invalid && loginForm.get('email')?.touched) {
              <p class="text-sm text-red-600 dark:text-red-400 mt-1">Please enter a valid email</p>
            }
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
            @if (loginForm.get('password')?.invalid && loginForm.get('password')?.touched) {
              <p class="text-sm text-red-600 dark:text-red-400 mt-1">Password is required</p>
            }
          </div>

          <button
            type="submit"
            [disabled]="loginForm.invalid || isLoading"
            class="btn btn-primary w-full"
          >
            @if (isLoading) {
              <span class="spinner mr-2"></span>
            }
            Sign In
          </button>
        </form>

        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?
            <a routerLink="/auth/register" class="text-primary-600 hover:text-primary-700 font-medium">
              Register
            </a>
          </p>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoading = false;
  errorMessage = '';

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    const { email, password } = this.loginForm.value;

    this.authService.signIn(email!, password!).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = this.getErrorMessage(error.code);
      }
    });
  }

  private getErrorMessage(code: string): string {
    switch (code) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        return 'Invalid email or password';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later';
      default:
        return 'An error occurred. Please try again';
    }
  }
}
