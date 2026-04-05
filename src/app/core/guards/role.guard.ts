import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { JwtService } from '../services/jwt.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const jwtService = inject(JwtService);
  const router = inject(Router);

  const expectedRole = route.data?.['role'];

  if (!jwtService.isAuthenticated()) {
    return router.createUrlTree(['/login']);
  }

  if (expectedRole && !jwtService.hasRole(expectedRole)) {
    return router.createUrlTree(['/unauthorized']);
  }

  return true;
};