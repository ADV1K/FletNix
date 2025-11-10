import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  // Check if token exists in localStorage (cookie is httpOnly and can't be read by JS)
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
  
  if (!token) {
    // Store the attempted URL for redirect after login
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
  
  return true;
};

