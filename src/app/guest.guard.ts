import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const guestGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('accessToken');

  if (token) {
    // If user is ALREADY logged in, kick them to dashboard
    router.navigate(['/dashboard']);
    return false;
  }
  
  // If no token, let them see the login page
  return true;
};