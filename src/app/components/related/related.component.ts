import { Component, inject } from '@angular/core';
import { MusicService } from '../../services/music.service';

@Component({
  selector: 'app-related',
  standalone: true,
  styleUrl: './related.component.scss',
  template: `
    <h2>Canciones relacionadas con el mismo género (Grafo no dirigido)</h2>
    @if (music.selected(); as s) {
      <p class="now">Basado en: <strong>{{ s.title }}</strong> — {{ s.artist }}</p>
      <ul>
        @for (r of music.relatedSongs(); track r.id) {
          <li (click)="music.select(r)">
            <div><strong>{{ r.title }}</strong><br><small>{{ r.artist }} · {{ r.genre }}</small></div>
          </li>
        } @empty { <li class="empty">Sin canciones similares aún</li> }
      </ul>
    } @else {
      <p class="empty">Selecciona una canción para ver recomendaciones</p>
    }
  `,
})
export class RelatedComponent { music = inject(MusicService); }
