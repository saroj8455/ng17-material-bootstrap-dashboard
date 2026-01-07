import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  // 1. Check if token exists in local storage
  const token = localStorage.getItem('accessToken');

  if (token) {
    // 2. If token exists, allow navigation
    return true;
  } else {
    // 3. If no token, redirect to Login page
    router.navigate(['/login']);
    return false;
  }
};