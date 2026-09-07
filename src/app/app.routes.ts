import { Routes } from '@angular/router';
import { SongPlayerComponent } from './pages/song-player/song-player.component';
import { BrowserHistoryComponent } from './pages/browser-history/browser-history.component';

export const routes: Routes = [
  { path: '', redirectTo: 'songs', pathMatch: 'full' },
  { path: 'songs', component: SongPlayerComponent },
  { path: 'history', component: BrowserHistoryComponent },
  { path: '**', redirectTo: 'songs' }
];
