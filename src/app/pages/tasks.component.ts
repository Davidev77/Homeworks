import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { Task, TasksService } from '../core/tasks.service';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [FormsModule],
  template: `
    <header class="bar">
      <label class="avatar-wrap" title="Dale click para cambiar tu foto de perfil">
        <span class="avatar">
          @if (auth.avatarUrl(); as url) {
            <img [src]="url" alt="Tu avatar" />
          } @else {
            <span>{{ initial() }}</span>
          }
        </span>
        <small class="avatar-hint">{{ uploading() ? 'Cargando…' : 'Cambiar foto' }}</small>
        <input type="file" accept="image/png,image/jpeg,image/webp" (change)="onAvatar($event)" hidden />
      </label>
      <div class="who">
        <strong>{{ auth.user()?.email }}</strong>
      </div>
      <button class="link" (click)="logout()">Cerrar sesión</button>
    </header>

    <main class="tasks">
      <form (ngSubmit)="add()" class="add">
        <input name="title" [(ngModel)]="newTitle" placeholder="¿Qué tienes que hacer?" maxlength="200" />
        <button class="primary" type="submit" [disabled]="!newTitle.trim()">Agregar tarea</button>
      </form>

      @if (error()) { <p class="msg error" role="alert">{{ error() }}</p> }

      @if (svc.tasks().length === 0) {
        <p class="empty">Todavía no tienes tareas, agrega la primera arriba.</p>
      }

      <ul>
        @for (t of svc.tasks(); track t.id) {
          <li [class.done]="t.done">
            <input type="checkbox" [checked]="t.done" (change)="run(svc.toggle(t))" [attr.aria-label]="'Marcar ' + t.title + ' como completada'" />

            @if (editingId() === t.id) {
              <input class="edit" [(ngModel)]="editTitle" (keyup.enter)="saveEdit(t)" (keyup.escape)="editingId.set(null)" autofocus />
              <button (click)="saveEdit(t)">Guardar</button>
              <button class="link" (click)="editingId.set(null)">Cancelar</button>
            } @else {
              <span class="title">{{ t.title }}</span>
              <button class="link" (click)="startEdit(t)">Editar</button>
              <button class="link danger" (click)="run(svc.remove(t))">Eliminar</button>
            }
          </li>
        }
      </ul>
    </main>
  `,
})
export class TasksComponent implements OnInit, OnDestroy {
  auth = inject(AuthService);
  svc = inject(TasksService);
  private router = inject(Router);

  newTitle = '';
  editTitle = '';
  editingId = signal<string | null>(null);
  uploading = signal(false);
  error = signal('');

  async ngOnInit() {
    await this.auth.ready;
    const user = this.auth.user();
    if (!user) {
      await this.router.navigateByUrl('/login');
      return;
    }

    await this.run(this.svc.load());
    this.svc.subscribe(user.id);
  }

  ngOnDestroy() {
    this.svc.unsubscribe();
  }

  initial() {
    return (this.auth.user()?.email ?? '?').charAt(0).toUpperCase();
  }

  async run(p: Promise<unknown>) {
    this.error.set('');
    try { await p; } catch (e: any) { this.error.set(e?.message ?? 'No se pudo completar la solicitud.'); }
  }

  async add() {
    const title = this.newTitle.trim();
    if (!title) return;
    this.newTitle = '';
    await this.run(this.svc.add(title));
  }

  startEdit(t: Task) {
    this.editingId.set(t.id);
    this.editTitle = t.title;
  }

  async saveEdit(t: Task) {
    const title = this.editTitle.trim();
    this.editingId.set(null);
    if (title && title !== t.title) await this.run(this.svc.rename(t, title));
  }

  async onAvatar(ev: Event) {
    const file = (ev.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.uploading.set(true);
    await this.run(this.auth.uploadAvatar(file));
    this.uploading.set(false);
  }

  async logout() {
    this.svc.unsubscribe();
    await this.auth.logout();
    await this.router.navigateByUrl('/login');
  }
}
