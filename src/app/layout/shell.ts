import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <header class="bar">
      <nav>
        <a routerLink="/exercise-1" routerLinkActive="active">Binary Trees</a>
        <a routerLink="/exercise-2" routerLinkActive="active">N-ary Trees</a>
      </nav>
      <div class="user">
        <span>Iniciaste sesión como <strong>{{ auth.username() }}</strong></span>
        <button type="button" (click)="logout()">Logout</button>
      </div>
    </header>
    <section class="content"><router-outlet /></section>
  `,
})
export class Shell {
  auth = inject(AuthService);
  private router = inject(Router);

  logout() {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}
