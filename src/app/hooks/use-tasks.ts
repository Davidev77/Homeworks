// Hook personalizado de tareas: estado reactivo + acciones sobre TaskService
import { inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of, switchMap, tap, timeout } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Task, TaskService } from '../services/task.service';

export function useTasks() {
  const auth = inject(AuthService);
  const service = inject(TaskService);

  const loading = signal(true);
  const error = signal('');

  const tasks = toSignal(
    auth.user$.pipe(
      timeout({ first: 10000 }),
      catchError(() => {
        error.set('No se pudo verificar la sesión. Comprueba tu conexión.');
        return of(null);
      }),
      tap(() => loading.set(true)),
      switchMap((u) =>
        u
          ? service.tasks$(u.uid).pipe(
              timeout({ first: 10000 }),
              catchError((cause: unknown) => {
                error.set(taskLoadErrorMessage(cause));
                return of([] as Task[]);
              })
            )
          : of([] as Task[])
      ),
      tap(() => loading.set(false))
    ),
    { initialValue: [] as Task[] }
  );

  async function guard(fn: () => Promise<unknown>): Promise<boolean> {
    error.set('');
    try {
      await fn();
      return true;
    } catch {
      error.set('El cambio no se guardó. Inténtalo de nuevo.');
      return false;
    }
  }

  return {
    tasks, loading, error,
    add: (d: { title: string; description: string }) => guard(() => service.create(auth.uid!, d)),
    edit: (id: string, d: { title: string; description: string }) => guard(() => service.update(id, d)),
    toggle: (id: string, done: boolean) => guard(() => service.toggle(id, done)),
    remove: (id: string) => guard(() => service.remove(id)),
  };
}

function taskLoadErrorMessage(cause: unknown): string {
  const code = (cause as { code?: string } | null)?.code;
  if (code === 'permission-denied') {
    return 'Firestore rechazó la lectura. Comprueba que esté habilitado y revisa las reglas de la colección tasks.';
  }
  if (code === 'unavailable' || code === 'deadline-exceeded' || (cause instanceof Error && cause.name === 'TimeoutError')) {
    return 'Firestore no responde. Comprueba tu conexión y que el servicio y la base de datos estén habilitados en Firebase.';
  }
  return 'No se pudieron cargar tus tareas. Revisa que Firestore esté habilitado y configurado en Firebase.';
}
