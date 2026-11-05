import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SearchService } from './core/search.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule],
  template: `
    <main>
      <h1>Buscador de zapatillas</h1>
      <p class="sub">Trie (prefijos) + Heap (Top K)</p>

      <section class="card">
        <input [(ngModel)]="query" placeholder="Busca por prefijo: air, adi, nike..." autofocus>
        <label>Top K <input type="number" min="1" max="50" [(ngModel)]="k" class="k"></label>
      </section>

      <section class="card">
        @for (p of results(); track p.name; let i = $index) {
          <div class="row">
            <span class="rank">{{ i + 1 }}</span>
            <span class="name">{{ p.name }}</span>
            <span class="bar"><i [style.width.%]="p.popularity"></i></span>
            <b>{{ p.popularity }}</b>
          </div>
        } @empty {
          <p class="empty">Sin resultados</p>
        }
      </section>

      <section class="card add">
        <input [(ngModel)]="newName" placeholder="Nuevo producto">
        <input type="number" min="0" max="100" [(ngModel)]="newPop" class="k">
        <button (click)="add()">Agregar</button>
      </section>
    </main>
  `,
  styles: `
    main { max-width: 640px; margin: 2rem auto; padding: 0 1rem; }
    h1 { margin: 0; } .sub { color: #666; margin-top: .25rem; }
    .card { background: #fff; border-radius: 12px; padding: 1rem; margin-bottom: 1rem;
            box-shadow: 0 1px 3px rgba(0,0,0,.08); display: flex; gap: .75rem; flex-wrap: wrap; align-items: center; }
    .card:nth-of-type(2) { flex-direction: column; align-items: stretch; }
    input { padding: .6rem .8rem; border: 1px solid #ccd; border-radius: 8px; font-size: 1rem; flex: 1; }
    input.k { flex: 0 0 80px; }
    button { padding: .6rem 1rem; border: 0; border-radius: 8px; background: #3b5bdb; color: #fff; cursor: pointer; }
    .row { display: flex; align-items: center; gap: .75rem; }
    .rank { width: 1.5rem; color: #888; } .name { flex: 0 0 160px; text-transform: capitalize; }
    .bar { flex: 1; height: 8px; background: #e9ecef; border-radius: 4px; overflow: hidden; }
    .bar i { display: block; height: 100%; background: #3b5bdb; }
    .empty { color: #888; margin: 0; }
  `,
})
export class AppComponent {
  private search = inject(SearchService);

  query = signal('air');
  k = signal(2);
  newName = signal('');
  newPop = signal(50);

  results = computed(() => {
    this.search.version(); // dependencia para refrescar tras insertar
    return this.search.searchTopK(this.query(), this.k());
  });

  add(): void {
    if (!this.newName().trim()) return;
    this.search.insert(this.newName(), this.newPop());
    this.newName.set('');
  }
}
