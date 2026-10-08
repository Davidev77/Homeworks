import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, take } from 'rxjs';
import { AuthService } from '../services/auth.service';

// Solo usuarios autenticados
export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  return inject(AuthService).user$.pipe(
    take(1),
    map((user) => (user ? true : router.createUrlTree(['/login'])))
  );
};

// Solo usuarios NO autenticados (login / register)
export const guestGuard: CanActivateFn = () => {
  const router = inject(Router);
  return inject(AuthService).user$.pipe(
    take(1),
    map((user) => (user ? router.createUrlTree(['/']) : true))
  );
};
