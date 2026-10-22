import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [FormsModule],
  template: `
    <main class="auth">
      <h1>{{ mode() === 'login' ? 'Iniciar sesión' : 'Crea tu cuenta' }}</h1>

      <form (ngSubmit)="submit()" #f="ngForm">
        <label>Correo electrónico
          <input type="email" name="email" [(ngModel)]="email" required autocomplete="email" />
        </label>
        <label>Contraseña
          <input type="password" name="password" [(ngModel)]="password" required minlength="6"
                 [autocomplete]="mode() === 'login' ? 'current-password' : 'new-password'" />
        </label>

        @if (error()) { <p class="msg error" role="alert">{{ error() }}</p> }
        @if (info()) { <p class="msg info">{{ info() }}</p> }

        <button class="primary" type="submit" [disabled]="f.invalid || busy()">
          {{ mode() === 'login' ? 'Iniciar sesión' : 'Crear cuenta' }}
        </button>
      </form>

      <button class="link" type="button" (click)="toggle()">
        {{ mode() === 'login' ? '¿Aún no tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión' }}
      </button>
    </main>
  `,
})
export class AuthComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  mode = signal<'login' | 'register'>('login');
  email = '';
  password = '';
  busy = signal(false);
  error = signal('');
  info = signal('');

  toggle() {
    this.mode.update((m) => (m === 'login' ? 'register' : 'login'));
    this.error.set('');
    this.info.set('');
  }

  async submit() {
    this.busy.set(true);
    this.error.set('');
    this.info.set('');
    try {
      if (this.mode() === 'login') {
        await this.auth.login(this.email, this.password);
        await this.router.navigateByUrl('/tasks');
      } else {
        const { needsConfirmation } = await this.auth.register(this.email, this.password);
        if (needsConfirmation) {
          this.info.set('Revisa tu bandeja de entrada y confirma tu correo electrónico; después, inicia sesión.');
          this.mode.set('login');
        } else {
          await this.router.navigateByUrl('/tasks');
        }
      }
    } catch (e: any) {
      this.error.set(e?.message ?? 'Algo salió mal. Inténtalo de nuevo.');
    } finally {
      this.busy.set(false);
    }
  }
}
