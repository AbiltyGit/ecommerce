import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const roleGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const userStr = localStorage.getItem('user');
  
  if (!userStr) {
    router.navigate(['/login']);
    return false;
  }

  try {
    const user = JSON.parse(userStr);
    const expectedRoles: string[] = route.data['expectedRoles'] || [];
    
    // Check if user has any of the expected roles
    const hasRole = user.roles && user.roles.some((role: string) => expectedRoles.includes(role));
    
    if (hasRole) {
      return true;
    } else {
      // User doesn't have required role, redirect to appropriate default page
      if (user.roles.includes('ADMIN')) {
        router.navigate(['/dashboard']);
      } else if (user.roles.includes('CORPORATE')) {
        router.navigate(['/admin/dashboard']);
      } else {
        router.navigate(['/products']);
      }
      return false;
    }
  } catch (e) {
    router.navigate(['/login']);
    return false;
  }
};
