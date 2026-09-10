import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from './auth.service';

export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.isAuthenticated()) {
      return router.createUrlTree(['/login']);
    }

    const currentUser = authService.currentUser();
    const userRoles = currentUser?.roles ?? [];

    if (allowedRoles.length === 0) {
      return true;
    }

    const hasAccess = userRoles.some((role) => allowedRoles.includes(role));

    return hasAccess ? true : router.createUrlTree(['/schools']);
  };
};
