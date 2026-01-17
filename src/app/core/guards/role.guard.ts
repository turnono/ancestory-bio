import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models';
import { map, take } from 'rxjs/operators';

/**
 * Role guard factory for protecting routes by user role
 * Usage: canActivate: [roleGuard(UserRole.ADMIN)]
 */
export function roleGuard(requiredRole: UserRole): CanActivateFn {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    return authService.userProfile$.pipe(
      take(1),
      map(user => {
        if (user && authService.canPerformAction(user, requiredRole)) {
          return true;
        }
        return router.createUrlTree(['/unauthorized']);
      })
    );
  };
}

/**
 * Admin-only guard
 */
export const adminGuard: CanActivateFn = roleGuard(UserRole.ADMIN);

/**
 * Researcher or higher guard
 */
export const researcherGuard: CanActivateFn = roleGuard(UserRole.RESEARCHER);
