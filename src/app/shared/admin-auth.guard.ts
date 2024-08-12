import { CanActivateFn, Router } from '@angular/router';
import { GoogleApiService } from '../services/google-api.service';
import { inject } from '@angular/core';

export const adminAuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(GoogleApiService);
  const router = inject(Router);

  
  if (authService.getUserId() === '116959800651110315212') {
    return true;
  } else {
    console.log('Acces refusé')
    router.navigate(['/']);

    return false;
  }
};
