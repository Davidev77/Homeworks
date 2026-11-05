import { Injectable, signal } from '@angular/core';
import { Product, Trie } from './trie';

@Injectable({ providedIn: 'root' })
export class SearchService {
  private trie = new Trie();
  // Cambia en cada insert para que los computed se recalculen 
  readonly version = signal(0);

  constructor() {
    [['air max', 90], ['air force', 95], ['air jordan', 85], ['adidas boost', 80],
     ['adidas samba', 88], ['nike dunk', 92], ['new balance 550', 78], ['puma suede', 70],
     ['reebok classic', 75], ['vans old skool', 82], ['converse chuck taylor', 77],
     ['nike air max 90', 91], ['nike air max 95', 93], ['nike air max 97', 89],
     ['adidas ultraboost', 94], ['adidas nmd', 87], ['adidas superstar', 86],
     ['new balance 990', 79], ['new balance 327', 81], ['puma rs-x', 83],
     ['reebok club c', 76], ['vans sk8-hi', 84], ['converse one star', 74]]
      .forEach(([n, p]) => this.trie.insert(n as string, p as number));
  }

  insert(name: string, popularity: number): void {
    this.trie.insert(name, popularity);
    this.version.update(v => v + 1);
  }

  searchTopK(prefix: string, k: number): Product[] {
    return this.trie.searchTopK(prefix, k);
  }
}
