import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MOCK_SONGS, Song, SongLinkedList } from '../../models/song-linked-list';

@Component({
  selector: 'app-song-player',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './song-player.component.html',
  styleUrl: './song-player.component.css'
})
export class SongPlayerComponent implements OnInit {
  private playlist = new SongLinkedList();

  currentSong: Song | null = null;
  songs: Song[] = [];
  currentIndex = 0;

  ngOnInit(): void {
    // Llena la linked list con las canciones de ejemplo
    MOCK_SONGS.forEach((song) => this.playlist.add(song));

    this.songs = this.playlist.toArray();
    this.currentSong = this.playlist.getCurrent();
    this.currentIndex = this.playlist.currentIndex();
  }

  playNext(): void {
    const next = this.playlist.next();
    if (next) {
      this.currentSong = next;
      this.currentIndex = this.playlist.currentIndex();
    }
  }

  restart(): void {
    this.currentSong = this.playlist.restart();
    this.currentIndex = this.playlist.currentIndex();
  }

  get hasNext(): boolean {
    return this.playlist.hasNext();
  }

  get isAtStart(): boolean {
    return this.playlist.isAtStart();
  }
}
