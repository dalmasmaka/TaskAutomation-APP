import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { JwtService } from '../services/jwt.service';

import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
export const roleGuard: CanActivateFn = (route, state) => {
  try {
    if (!isPlatformBrowser(inject(PLATFORM_ID))) {
  return true;
}
    const jwtService = inject(JwtService);
    const router = inject(Router);

    const token = jwtService.decodeToken();

    if (!token || !jwtService.isAuthenticated()) {
      return router.createUrlTree(['/auth']);
    }

    const expectedRole = route.data?.['role'];

    if (expectedRole && !jwtService.hasRole(expectedRole)) {
      return router.createUrlTree(['/unauthorized']);
    }

    return true;
  } catch (e) {
    console.error('Guard error:', e);
    return inject(Router).createUrlTree(['/auth']);
  }
};