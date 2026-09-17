export class Stack<T> {
  private items: T[] = [];

  /** Agrega un elemento al top de la pila */
  push(item: T): void {
    this.items.push(item);
  }

  /** Elimina y devuelve el último elemento de la pila, o undefined si está vacía */
  pop(): T | undefined {
    return this.items.pop();
  }

  /** Devuelve el último elemento de la pila sin eliminarlo */
  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  /** Verdadero cuando la pila no tiene elementos */
  isEmpty(): boolean {
    return this.items.length === 0;
  }

  /** Número de elementos actualmente en la pila */
  get size(): number {
    return this.items.length;
  }

  /** Devuelve un arreglo con los elementos de la pila, con el top primero */
  toArray(): T[] {
    return [...this.items].reverse();
  }
}
