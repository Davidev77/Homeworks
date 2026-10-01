import { Injectable, computed, signal } from '@angular/core';

export interface User {
  email: string;
  username: string;
}

const STORAGE_KEY = 'demo-user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Credenciales
  private readonly VALID_EMAIL = 'user@mail.com';
  private readonly VALID_PASSWORD = '123';

  private readonly _user = signal<User | null>(this.restore());

  readonly user = this._user.asReadonly();
  readonly isLoggedIn = computed(() => this._user() !== null);
  readonly username = computed(() => this._user()?.username ?? '');

  login(email: string, password: string): boolean {
    if (email.trim().toLowerCase() === this.VALID_EMAIL && password === this.VALID_PASSWORD) {
      const user: User = { email: this.VALID_EMAIL, username: this.VALID_EMAIL.split('@')[0] };
      this._user.set(user);
      try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user)); } catch {}
      return true;
    }
    return false;
  }

  logout(): void {
    this._user.set(null);
    try { sessionStorage.removeItem(STORAGE_KEY); } catch {}
  }

  private restore(): User | null {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  }
}
