import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from '../shared/services/login.service';

export const roleGuard = (
  allowedRoles: ('admin' | 'user' | 'unauthenticated')[]
): CanActivateFn => {
  return () => {
    const auth = inject(LoginService);
    const router = inject(Router);

    if (!auth.isLoggedIn()) {
      router.navigate(['/login']);
      return false;
    }

    if (allowedRoles.includes(auth.userRole)) {
      return true;
    } else {
      router.navigate(['/unauthorized']);
      return false;
    }
  };
};
