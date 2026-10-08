import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { useAuth } from '../hooks/use-auth';
import { useTasks } from '../hooks/use-tasks';

type Filter = 'all' | 'open' | 'done';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [FormsModule],
  template: `
    <nav class="app-nav">
      <div class="container d-flex align-items-center justify-content-between">
        <span class="brand">Firebase Taskboard</span>
        <div class="d-flex align-items-center gap-3">
          <span class="text-muted small d-none d-sm-inline">{{ auth.user()?.displayName || auth.user()?.email }}</span>
          <button class="btn btn-outline-primary btn-sm" (click)="auth.logout()">Cerrar sesión</button>
        </div>
      </div>
    </nav>

    <main class="container tasks-page">
      <header class="mb-4">
        <h1>Tus tareas</h1>
        <p class="text-muted mb-0">{{ doneCount() }} de {{ t.tasks().length }} completadas</p>
      </header>

      <section class="panel mb-4">
        <form class="task-form" (ngSubmit)="create()">
          <input class="form-control" name="title" placeholder="Título de la tarea" [(ngModel)]="newTask.title" required />
          <textarea class="form-control" name="description" rows="2" placeholder="Notas (es opcional)" [(ngModel)]="newTask.description"></textarea>
          <div><button class="btn btn-primary" type="submit">Agregar tarea</button></div>
        </form>
      </section>

      @if (t.error()) { <div class="alert alert-danger">{{ t.error() }}</div> }

      <div class="btn-group mb-3" role="group" aria-label="Filtrar tareas">
        @for (f of filters; track f.value) {
          <button class="btn btn-sm" [class.btn-primary]="filter() === f.value"
            [class.btn-outline-primary]="filter() !== f.value" (click)="filter.set(f.value)">{{ f.label }}</button>
        }
      </div>

      @if (t.loading()) {
        <div class="spinner-border text-primary"></div>
      } @else if (visible().length === 0) {
        <p class="empty">{{ t.tasks().length ? 'No hay tareas en esta vista.' : 'Aún no hay tareas. Agrega la primera arriba.' }}</p>
      } @else {
        <ul class="task-list">
          @for (task of visible(); track task.id) {
            @if (editingId() === task.id) {
              <li class="task-item editing">
                <form class="task-form" (ngSubmit)="saveEdit(task.id)">
                  <input class="form-control" name="etitle" [(ngModel)]="draft.title" required />
                  <textarea class="form-control" name="edesc" rows="2" [(ngModel)]="draft.description"></textarea>
                  <div class="d-flex gap-2">
                    <button class="btn btn-primary" type="submit">Guardar cambios</button>
                    <button class="btn btn-light" type="button" (click)="editingId.set(null)">Cancelar</button>
                  </div>
                </form>
              </li>
            } @else {
              <li class="task-item" [class.is-done]="task.done">
                <div class="task-body">
                  <div class="task-title">{{ task.title }}</div>
                  @if (task.description) { <div class="task-desc">{{ task.description }}</div> }
                </div>
                <div class="task-actions">
                  <button class="btn btn-sm btn-outline-success" (click)="toggleTask(task)">
                    {{ task.done ? 'Reabrir' : 'Marcar hecha' }}
                  </button>
                  <button class="btn btn-sm btn-outline-primary" (click)="startEdit(task)">Editar</button>
                  <button class="btn btn-sm btn-outline-danger" (click)="t.remove(task.id)">Eliminar</button>
                </div>
              </li>
            }
          }
        </ul>
      }
    </main>
  `,
})
export class TasksComponent {
  auth = useAuth();
  t = useTasks();

  filters: { value: Filter; label: string }[] = [
    { value: 'all', label: 'Todas' },
    { value: 'open', label: 'Pendientes' },
    { value: 'done', label: 'Hechas' },
  ];
  filter = signal<Filter>('all');
  editingId = signal<string | null>(null);
  newTask = { title: '', description: '' };
  draft = { title: '', description: '' };

  doneCount = computed(() => this.t.tasks().filter((x) => x.done).length);
  visible = computed(() =>
    this.t.tasks().filter((x) => this.filter() === 'all' || (this.filter() === 'done' ? x.done : !x.done))
  );

  async create() {
    if (!this.newTask.title.trim()) return;
    const added = await this.t.add({ title: this.newTask.title.trim(), description: this.newTask.description.trim() });
    if (added) this.newTask = { title: '', description: '' };
  }

  startEdit(task: { id: string; title: string; description: string }) {
    this.draft = { title: task.title, description: task.description };
    this.editingId.set(task.id);
  }

  async saveEdit(id: string) {
    if (!this.draft.title.trim()) return;
    const save = this.t.edit(id, { title: this.draft.title.trim(), description: this.draft.description.trim() });
    this.editingId.set(null);
    await save;
  }

  async toggleTask(task: { id: string; done: boolean }) {
    const updated = await this.t.toggle(task.id, !task.done);
    if (updated) this.filter.set(task.done ? 'open' : 'done');
  }
}
