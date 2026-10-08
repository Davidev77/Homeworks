// Servicio de autenticación: único lugar que habla con Firebase Auth
import { Injectable, inject } from '@angular/core';
import {
  Auth, authState, createUserWithEmailAndPassword,
  signInWithEmailAndPassword, signOut, updateProfile,
} from '@angular/fire/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth);
  readonly user$ = authState(this.auth);

  get uid(): string | null {
    return this.auth.currentUser?.uid ?? null;
  }

  async register(data: { name: string; email: string; password: string }) {
    const { user } = await createUserWithEmailAndPassword(this.auth, data.email, data.password);
    if (data.name) await updateProfile(user, { displayName: data.name });
    return user;
  }

  async login(data: { email: string; password: string }) {
    const { user } = await signInWithEmailAndPassword(this.auth, data.email, data.password);
    return user;
  }

  logout() {
    return signOut(this.auth);
  }
}

export function authErrorMessage(err: any): string {
  const map: Record<string, string> = {
    'auth/invalid-credential': 'El correo o la contraseña son incorrectos.',
    'auth/email-already-in-use': 'Ese correo ya tiene cuenta. Intenta iniciar sesión.',
    'auth/weak-password': 'Usa una contraseña de al menos 6 caracteres.',
    'auth/invalid-email': 'Escribe un correo válido.',
    'auth/too-many-requests': 'Demasiados intentos. Espera un momento.',
  };
  return map[err?.code] ?? 'Algo salió mal. Inténtalo de nuevo.';
}
