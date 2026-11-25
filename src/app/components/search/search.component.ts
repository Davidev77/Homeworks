import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MusicService } from '../../services/music.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [FormsModule],
  styleUrl: './search.component.scss',
  template: `
    <h2>Buscador predictivo (Trie)</h2>
    <input class="search" placeholder="Escribe un título, por ejemplo Billie Jean"
           [ngModel]="query()" (ngModelChange)="query.set($event)" />
    @if (query().trim()) {
      <p class="status" [class.ok]="exact()">
        {{ exact() ? 'La canción existe' : 'No hay coincidencia exacta' }}
      </p>
    }
    <ul>
      @for (s of suggestions(); track s.id) {
        <li (click)="music.select(s)">
          <div><strong>{{ s.title }}</strong><br><small>{{ s.artist }} · {{ s.genre }}</small></div>
        </li>
      }
    </ul>

    <h2 class="add-title">Insertar canción</h2>
    <div class="add">
      <input placeholder="Título" [(ngModel)]="title" />
      <input placeholder="Artista" [(ngModel)]="artist" />
      <select aria-label="Género de la canción" [(ngModel)]="genre">
        <option value="Pop">Pop</option>
        <option value="Rock">Rock</option>
        <option value="Reggaeton">Reggaeton</option>
        <option value="Salsa">Salsa</option>
        <option value="Otro">Otro</option>
      </select>
      <button (click)="add()">Agregar</button>
    </div>
    @if (msg()) { <p class="status">{{ msg() }}</p> }
  `,
})
export class SearchComponent {
  music = inject(MusicService);
  query = signal('');
  title = ''; artist = ''; genre = 'Pop';
  msg = signal('');
  suggestions = computed(() => this.music.suggest(this.query()));
  exact = computed(() => this.music.exists(this.query().trim()));


  add(): void {
    const ok = this.music.addSong(this.title, this.artist, this.genre);
    this.msg.set(ok ? 'Canción agregada' : 'Título vacío o ya existente');
    if (ok) { this.title = ''; this.artist = ''; }
  }
}
