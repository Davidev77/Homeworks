import { Injectable, signal } from '@angular/core';
import { Song } from '../models/song';
import { Trie } from '../data-structures/trie';
import { MaxHeap } from '../data-structures/max-heap';
import { Graph } from '../data-structures/graph';

@Injectable({ providedIn: 'root' })
export class MusicService {
  private trie = new Trie();
  private heap = new MaxHeap<Song>((a, b) => a.plays - b.plays);
  private graph = new Graph();
  private byId = new Map<number, Song>();
  private byTitle = new Map<string, Song>();
  private nextId = 1;

  readonly top = signal<Song[]>([]);
  readonly selected = signal<Song | null>(null);
  readonly relatedSongs = signal<Song[]>([]);

  constructor() {
    const seed: [string, string, string, number][] = [
      ['November Rain', 'Guns N Roses', 'Rock', 980],
      ['Billie Jean', 'Michael Jackson', 'Pop', 870],
      ['Smooth Criminal', 'Michael Jackson', 'Pop', 940],
      ['In The End', 'Linkin Park', 'Rock', 890],
      ['Beat It', 'Michael Jackson', 'Pop', 720],
      ['Believer', 'Imagine Dragons', 'Rock', 650],
      ['Busca Por Dentro', 'Grupo Niche', 'Salsa', 900],
      ['Sin Sentimiento', 'Grupo Niche', 'Salsa', 700],
      ['Idilio', 'Willie Colón', 'Salsa', 500],
      ['Stairway to Heaven', 'Led Zeppelin', 'Rock', 800],
      ['Hotel California', 'Eagles', 'Rock', 760],
      ['Pneuma', 'Tool', 'Rock', 680],
      ['Enter Sandman', 'Metallica', 'Rock', 930],
      ['Gasolina', 'Daddy Yankee', 'Reggaeton', 640],
    ];
    seed.forEach(([t, a, g, p]) => this.addSong(t, a, g, p));
    this.refreshTop();
  }

  /** Inserta en Trie, Heap y Grafo. */
  addSong(title: string, artist: string, genre = 'Otro', plays = 0): boolean {
    title = title.trim();
    if (!title || this.trie.search(title)) return false;
    const song: Song = { id: this.nextId++, title, artist: artist.trim() || 'Desconocido', genre, plays };
    this.byId.set(song.id, song);
    this.byTitle.set(title.toLowerCase(), song);
    this.trie.insert(title);
    this.graph.addVertex(song.id);
    for (const existing of this.byId.values()) {
      if (existing.id !== song.id && existing.genre === song.genre) {
        this.graph.addEdge(song.id, existing.id);
      }
    }
    this.heap.insert(song);
    this.refreshTop();
    return true;
  }

  exists(title: string): boolean { return this.trie.search(title); }

  suggest(prefix: string): Song[] {
    if (!prefix.trim()) return [];
    return this.trie.suggest(prefix, 6).map(t => this.byTitle.get(t.toLowerCase())!);
  }

  select(song: Song): void {
    this.selected.set(song);
    const related = this.graph.neighbors(song.id)
      .map(id => this.byId.get(id)!)
      .filter(candidate => candidate.genre === song.genre);
    this.relatedSongs.set(related.slice(0, 6));
  }

  play(song: Song): void {
    song.plays++;
    this.heap.buildFrom([...this.byId.values()]);
    this.refreshTop();
  }

  private refreshTop(): void { this.top.set(this.heap.topN(5)); }
}
