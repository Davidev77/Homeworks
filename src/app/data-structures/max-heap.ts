// Max Heap
export class MaxHeap<T> {
  private data: T[] = [];
  constructor(private compare: (a: T, b: T) => number) {}

  get size(): number { return this.data.length; }
  peek(): T | undefined { return this.data[0]; }

  insert(item: T): void {
    this.data.push(item);
    this.siftUp(this.data.length - 1);
  }

  // extrae el máximo 
  extractMax(): T | undefined {
    if (!this.data.length) return undefined;
    const top = this.data[0];
    const last = this.data.pop()!;
    if (this.data.length) { this.data[0] = last; this.siftDown(0); }
    return top;
  }

  // reconstruye el heap 
  buildFrom(items: T[]): void {
    this.data = [...items];
    for (let i = Math.floor(this.data.length / 2) - 1; i >= 0; i--) this.siftDown(i);
  }

  // Devuelve las n canciones más escuchadas sin modificar el heap original
  topN(n: number): T[] {
    const copy = new MaxHeap<T>(this.compare);
    copy.data = [...this.data];
    const res: T[] = [];
    while (res.length < n && copy.size) res.push(copy.extractMax()!);
    return res;
  }

  private siftUp(i: number): void {
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.compare(this.data[i], this.data[p]) <= 0) break;
      [this.data[i], this.data[p]] = [this.data[p], this.data[i]];
      i = p;
    }
  }

  private siftDown(i: number): void {
    const n = this.data.length;
    while (true) {
      let m = i;
      const l = 2 * i + 1, r = l + 1;
      if (l < n && this.compare(this.data[l], this.data[m]) > 0) m = l;
      if (r < n && this.compare(this.data[r], this.data[m]) > 0) m = r;
      if (m === i) break;
      [this.data[i], this.data[m]] = [this.data[m], this.data[i]];
      i = m;
    }
  }
}
