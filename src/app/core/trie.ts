import { MinHeap } from './min-heap';

export interface Product { name: string; popularity: number; }

class TrieNode {
  children = new Map<string, TrieNode>();
  product: Product | null = null; // != null,  aquí termina un producto
}

export class Trie {
  private root = new TrieNode();

  private normalize(s: string): string { return s.trim().toLowerCase(); }

  // Si el producto ya existe, actualiza su popularidad
  insert(name: string, popularity: number): void {
    const clean = name.trim();
    if (!clean) return;
    let node = this.root;
    for (const ch of this.normalize(clean)) {
      if (!node.children.has(ch)) node.children.set(ch, new TrieNode());
      node = node.children.get(ch)!;
    }
    node.product = { name: clean, popularity };
  }

  // Baja hasta el nodo del prefijo
  private findNode(prefix: string): TrieNode | null {
    let node = this.root;
    for (const ch of this.normalize(prefix)) {
      const next = node.children.get(ch);
      if (!next) return null;
      node = next;
    }
    return node;
  }

  // Todos los productos bajo un prefijo 
  private collect(prefix: string): Product[] {
    const start = this.findNode(prefix);
    if (!start) return [];
    const result: Product[] = [];
    const stack = [start];
    while (stack.length) {
      const node = stack.pop()!;
      if (node.product) result.push(node.product);
      node.children.forEach(child => stack.push(child));
    }
    return result;
  }

  // Buscar el top de los mas populares bajo un prefijo
  searchTopK(prefix: string, k: number): Product[] {
    if (k <= 0) return [];
    const heap = new MinHeap<Product>((a, b) => a.popularity - b.popularity);
    for (const p of this.collect(prefix)) {
      if (heap.size < k) heap.push(p);
      else if (p.popularity > heap.peek()!.popularity) { heap.pop(); heap.push(p); }
    }
    const out: Product[] = [];
    while (heap.size) out.push(heap.pop()!);
    return out.reverse(); // de mayor a menor popularidad
  }
}
