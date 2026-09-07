export interface Song {
  title: string;
  artist: string;
  duration: string; 
}

// linked list

export class SongNode {
  next: SongNode | null = null;

  constructor(public song: Song) {}
}


export class SongLinkedList {
  private head: SongNode | null = null;
  private tail: SongNode | null = null;
  private current: SongNode | null = null;
  private length = 0;

  add(song: Song): void {
    const node = new SongNode(song);

    if (!this.head || !this.tail) {
      this.head = node;
      this.tail = node;
      this.current = node;
    } else {
      this.tail.next = node;
      this.tail = node;
    }

    this.length++;
  }

  next(): Song | null {
    if (this.current?.next) {
      this.current = this.current.next;
      return this.current.song;
    }
    return null;
  }

  restart(): Song | null {
    this.current = this.head;
    return this.current ? this.current.song : null;
  }

  getCurrent(): Song | null {
    return this.current ? this.current.song : null;
  }

  hasNext(): boolean {
    return !!this.current?.next;
  }

  isAtStart(): boolean {
    return this.current === this.head;
  }

  size(): number {
    return this.length;
  }

  // Hace un array de las canciones en la lista
  toArray(): Song[] {
    const result: Song[] = [];
    let node = this.head;
    while (node) {
      result.push(node.song);
      node = node.next;
    }
    return result;
  }

  currentIndex(): number {
    let index = -1;
    let i = 0;
    let node = this.head;
    while (node) {
      if (node === this.current) {
        index = i;
        break;
      }
      node = node.next;
      i++;
    }
    return index;
  }
}

export const MOCK_SONGS: Song[] = [
  { title: 'Lying From You', artist: 'Linkin Park', duration: '2:55' },
  { title: 'El Sonidito', artist: 'Hechizeros Band', duration: '3:19' },
  { title: 'Sin Sentimientos', artist: 'Grupo Niche', duration: '4:53' },
  { title: 'Come As You Are', artist: 'Nirvana', duration: '3:39' },
  { title: 'Redbone', artist: 'Childish Gambino', duration: '5:27' },
  { title: 'Instant Crush', artist: 'Daft Punk ft. Julian Casablancas', duration: '5:37' }
];
