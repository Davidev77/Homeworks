export class MinHeap<T> {
  private data: T[] = [];

  constructor(private readonly compare: (a: T, b: T) => number) {}

  get size(): number { return this.data.length; }

  peek(): T | undefined { return this.data[0]; }

  push(item: T): void {
    this.data.push(item);
    let i = this.data.length - 1;
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (this.compare(this.data[i], this.data[parent]) >= 0) break;
      [this.data[i], this.data[parent]] = [this.data[parent], this.data[i]];
      i = parent;
    }
  }

  pop(): T | undefined {
    if (!this.data.length) return undefined;
    const top = this.data[0];
    const last = this.data.pop()!;
    if (this.data.length) {
      this.data[0] = last;
      let i = 0;
      const n = this.data.length;
      while (true) {
        const l = 2 * i + 1, r = l + 1;
        let m = i;
        if (l < n && this.compare(this.data[l], this.data[m]) < 0) m = l;
        if (r < n && this.compare(this.data[r], this.data[m]) < 0) m = r;
        if (m === i) break;
        [this.data[i], this.data[m]] = [this.data[m], this.data[i]];
        i = m;
      }
    }
    return top;
  }
}
