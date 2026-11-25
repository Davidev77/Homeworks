import { Component, computed, inject } from '@angular/core';
import { MusicService } from '../../services/music.service';

@Component({
  selector: 'app-ranking',
  standalone: true,
  styleUrl: './ranking.component.scss',
  template: `
    <h2>Top canciones más escuchadas (Max Heap)</h2>
    <ul>
      @for (s of music.top(); track s.id; let i = $index) {
        <li (click)="music.select(s)">
          <span class="pos" [class]="'pos p' + (i + 1)">{{ i + 1 }}</span>
          <div class="info">
            <strong>{{ s.title }}</strong>
            <small>{{ s.artist }}</small>
            <div class="bar"><span [style.width.%]="pct(s.plays)"></span></div>
          </div>
          <span class="plays">{{ s.plays }}</span>
          <button (click)="$event.stopPropagation(); music.play(s)">▶</button>
        </li>
      }
    </ul>
  `,
})
export class RankingComponent {
  music = inject(MusicService);
  max = computed(() => this.music.top()[0]?.plays || 1);
  pct(p: number): number { return (p / this.max()) * 100; }
}
