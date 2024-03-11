import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { GoogleApiService } from '../services/google-api.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(GoogleApiService);

  if (authService.isLoggedIn()) {
    return true;
  } else {
    authService.signIn();
    return false;
  }
};
