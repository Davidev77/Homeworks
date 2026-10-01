import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-login',
  template: `
    <main class="card">
      <h1>Demo Login</h1>

      <label for="email">Email </label>
      <input id="email" type="email" placeholder="user@mail.com"
             [value]="email()" (input)="email.set($any($event.target).value)" />

      <label for="password">Contraseña</label>
      <input id="password" type="password" placeholder="123"
             [value]="password()" (input)="password.set($any($event.target).value)"
             (keydown.enter)="submit()" />

      @if (error()) {
        <p class="error">{{ error() }}</p>
      }

      <button type="button" (click)="submit()">Login</button>
    </main>
  `,
})
export class Login {
  private auth = inject(AuthService);
  private router = inject(Router);

  email = signal('');
  password = signal('');
  error = signal('');

  submit() {
    if (this.auth.login(this.email(), this.password())) {
      this.error.set('');
      this.router.navigateByUrl('/');
    } else {
      this.error.set('Correo o contraseña incorrectos.');
    }
  }
}
