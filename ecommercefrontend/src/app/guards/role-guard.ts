import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth';

export const roleGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  
  const userRole = authService.getUserRole();
  
  if (!userRole) {
    router.navigate(['/login']);
    return false;
  }

  const expectedRoles: string[] = route.data['expectedRoles'] || [];
  
  // Check if user has any of the expected roles
  if (expectedRoles.includes(userRole)) {
    return true;
  } else {
    // User doesn't have required role, redirect to appropriate default page
    if (userRole === 'ADMIN') {
      router.navigate(['/dashboard']);
    } else if (userRole === 'CORPORATE') {
      router.navigate(['/admin/dashboard']);
    } else {
      router.navigate(['/products']);
    }
    return false;
  }
};
