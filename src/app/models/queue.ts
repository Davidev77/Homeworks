export class Queue<T> {
  private items: T[] = [];

  /** Encola (agrega) un elemento al final de la fila */
  enqueue(item: T): void {
    this.items.push(item);
  }

  /** Desencola y devuelve el elemento al frente de la fila, o undefined si está vacía */
  dequeue(): T | undefined {
    return this.items.shift();
  }

  /** Devuelve el elemento al frente de la fila sin quitarlo */
  front(): T | undefined {
    return this.items[0];
  }

  /** True cuando la fila no tiene elementos */
  isEmpty(): boolean {
    return this.items.length === 0;
  }

  /** Cantidad de elementos actualmente en la fila */
  get size(): number {
    return this.items.length;
  }

  /**
   * Devuelve el contenido de la fila como un arreglo plano,
   * en el mismo orden en que fueron encolados (frente primero)
   */
  toArray(): T[] {
    return [...this.items];
  }
}
