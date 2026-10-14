import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { Autenticacion } from '../../services/authentication';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  private readonly auth = inject(Autenticacion);
  private readonly router = inject(Router);

  correo = '';
  clave = '';
  claveConfirmacion = '';

  readonly modoRegistro = signal(false);
  readonly enviando = signal(false);
  readonly error = signal('');

  cambiarModo(): void {
    this.modoRegistro.update(registro => !registro);
    this.clave = '';
    this.claveConfirmacion = '';
    this.error.set('');
  }

  async ingresar(): Promise<void> {
    if (this.enviando()) {
      return;
    }

    this.error.set('');
    this.enviando.set(true);

    try {
      await this.auth.login(this.correo, this.clave);
      await this.router.navigate(['/explorador']);
    } catch (error: unknown) {
      this.error.set(
        error instanceof Error ? error.message : 'Ocurrió un error inesperado.'
      );
    } finally {
      this.enviando.set(false);
    }
  }

  async crearCuenta(): Promise<void> {
    if (this.enviando()) {
      return;
    }

    if (this.clave !== this.claveConfirmacion) {
      this.error.set('Las contraseñas no coinciden.');
      return;
    }

    this.error.set('');
    this.enviando.set(true);

    try {
      await this.auth.registrar(this.correo, this.clave);
      await this.router.navigate(['/explorador']);
    } catch (error: unknown) {
      this.error.set(
        error instanceof Error ? error.message : 'Ocurrió un error inesperado.'
      );
    } finally {
      this.enviando.set(false);
    }
  }
}