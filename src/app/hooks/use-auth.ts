// Hook personalizado de autenticación (llamar en un contexto de inyección: campo de componente)
import { inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { AuthService, authErrorMessage } from '../services/auth.service';

export function useAuth() {
  const service = inject(AuthService);
  const router = inject(Router);

  const user = toSignal(service.user$, { initialValue: null });
  const loading = signal(false);
  const error = signal('');

  async function run(fn: () => Promise<unknown>, redirectTo: string) {
    loading.set(true);
    error.set('');
    try {
      await fn();
      await router.navigate([redirectTo]);
    } catch (err) {
      error.set(authErrorMessage(err));
    } finally {
      loading.set(false);
    }
  }

  return {
    user, loading, error,
    login: (d: { email: string; password: string }) => run(() => service.login(d), '/'),
    register: (d: { name: string; email: string; password: string }) => run(() => service.register(d), '/'),
    logout: () => run(() => service.logout(), '/login'),
  };
}
