import { Component } from '@angular/core';
import { SearchComponent } from './components/search/search.component';
import { RankingComponent } from './components/ranking/ranking.component';
import { RelatedComponent } from './components/related/related.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SearchComponent, RankingComponent, RelatedComponent],
  styleUrl: './app.component.scss',
  template: `
    <header><h1>Spotify Educativo</h1></header>
    <main>
      <app-search /><app-ranking /><app-related />
    </main>
  `,
})
export class AppComponent {}
