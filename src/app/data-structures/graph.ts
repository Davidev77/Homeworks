// Grafo no dirigido 
export class Graph {
  private adj = new Map<number, Set<number>>();

  addVertex(v: number): void {
    if (!this.adj.has(v)) this.adj.set(v, new Set());
  }

  addEdge(a: number, b: number): void {
    if (a === b) return;
    this.addVertex(a); this.addVertex(b);
    this.adj.get(a)!.add(b);
    this.adj.get(b)!.add(a);
  }

  neighbors(v: number): number[] {
    return [...(this.adj.get(v) ?? [])];
  }
}
