import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { useAuth } from '../hooks/use-auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="page-center">
      <form class="auth-card" (ngSubmit)="auth.login(form)">
        <h1>Iniciar sesión</h1>
        @if (auth.error()) { <div class="alert alert-danger py-2">{{ auth.error() }}</div> }
        <label class="form-label">Correo</label>
        <input class="form-control mb-3" type="email" name="email" [(ngModel)]="form.email" required />
        <label class="form-label">Contraseña</label>
        <input class="form-control mb-4" type="password" name="password" [(ngModel)]="form.password" required />
        <button class="btn btn-primary w-100" [disabled]="auth.loading()">
          {{ auth.loading() ? 'Entrando…' : 'Iniciar sesión' }}
        </button>
        <p class="mt-3 mb-0 small text-center">¿No tienes cuenta? <a routerLink="/register">Crea una aquí</a></p>
      </form>
    </div>
  `,
})
export class LoginComponent {
  auth = useAuth();
  form = { email: '', password: '' };
}
