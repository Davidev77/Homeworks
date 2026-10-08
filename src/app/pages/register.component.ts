import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { useAuth } from '../hooks/use-auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="page-center">
      <form class="auth-card" (ngSubmit)="auth.register(form)">
        <h1>Crear cuenta</h1>
        @if (auth.error()) { <div class="alert alert-danger py-2">{{ auth.error() }}</div> }
        <label class="form-label">Nombre</label>
        <input class="form-control mb-3" name="name" [(ngModel)]="form.name" required />
        <label class="form-label">Correo</label>
        <input class="form-control mb-3" type="email" name="email" [(ngModel)]="form.email" required />
        <label class="form-label">Contraseña</label>
        <input class="form-control mb-4" type="password" name="password" minlength="6" [(ngModel)]="form.password" required />
        <button class="btn btn-primary w-100" [disabled]="auth.loading()">
          {{ auth.loading() ? 'Creando…' : 'Crear cuenta' }}
        </button>
        <p class="mt-3 mb-0 small text-center">¿Ya tienes cuenta? <a routerLink="/login">Iniciar sesión</a></p>
      </form>
    </div>
  `,
})
export class RegisterComponent {
  auth = useAuth();
  form = { name: '', email: '', password: '' };
}
