import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { Autenticacion } from '../services/authentication';

export const authGuard: CanActivateFn = async () => {
  const auth = inject(Autenticacion);
  const router = inject(Router);

  await auth.esperarSesion();

  return auth.correo() ? true : router.createUrlTree(['/login']);
};

export const invitadoGuard: CanActivateFn = async () => {
  const auth = inject(Autenticacion);
  const router = inject(Router);

  await auth.esperarSesion();

  return auth.correo() ? router.createUrlTree(['/explorador']) : true;
};