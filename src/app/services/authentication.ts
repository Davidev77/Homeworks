import { Injectable, computed, signal } from '@angular/core';
import { FirebaseError } from 'firebase/app';
import {
  User,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';

import { firebaseAuth } from '../firebase/firebase';

@Injectable({ providedIn: 'root' })
export class Autenticacion {
  private readonly usuario = signal<User | null>(null);

  readonly listo = signal(false);
  readonly correo = computed(() => this.usuario()?.email ?? null);

  constructor() {
    onAuthStateChanged(firebaseAuth, usuario => {
      this.usuario.set(usuario);
      this.listo.set(true);
    });
  }
    esperarSesion(): Promise<void> {
    if (this.listo()) {
      return Promise.resolve();
    }

    return new Promise(resolve => {
      const detener = onAuthStateChanged(firebaseAuth, () => {
        detener();
        resolve();
      });
    });
  }

  async login(correo: string, clave: string): Promise<void> {
    try {
      await signInWithEmailAndPassword(
        firebaseAuth,
        correo.trim(),
        clave
      );
    } catch (error: unknown) {
      throw new Error(this.traducir(error));
    }
  }

  async registrar(correo: string, clave: string): Promise<void> {
    try {
      await createUserWithEmailAndPassword(
        firebaseAuth,
        correo.trim(),
        clave
      );
    } catch (error: unknown) {
      throw new Error(this.traducir(error));
    }
  }

  async logout(): Promise<void> {
    await signOut(firebaseAuth);
  }

  exigirCorreo(): string {
    const correo = firebaseAuth.currentUser?.email;

    if (!correo) {
      throw new Error('Debes iniciar sesión con un usuario registrado.');
    }

    return correo;
  }

  private traducir(error: unknown): string {
    if (!(error instanceof FirebaseError)) {
      return 'Ocurrió un error inesperado.';
    }

    switch (error.code) {
      case 'auth/invalid-credential':
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        return 'Correo o contraseña incorrectos.';
      case 'auth/invalid-email':
        return 'El correo no es válido.';
      case 'auth/email-already-in-use':
        return 'Ya existe una cuenta con ese correo.';
      case 'auth/weak-password':
        return 'La contraseña debe tener al menos 6 caracteres.';
      case 'auth/too-many-requests':
        return 'Demasiados intentos. Espera un momento.';
      case 'auth/network-request-failed':
        return 'No hay conexión con Firebase.';
      case 'auth/operation-not-allowed':
        return 'Habilita Email/Password en Firebase Authentication.';
      default:
        return 'No se pudo iniciar sesión.';
    }
  }
}