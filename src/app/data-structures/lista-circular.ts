// Lista circular, la usamos para ir rotando el medico de guardia
// el ultimo nodo apunta otra vez al primero, por eso es circular

export class NodoCircular<T> {
  valor: T;
  siguiente: NodoCircular<T> | null = null;

  constructor(valor: T) {
    this.valor = valor;
  }
}

export class ListaCircular<T extends { id: number }> {
  actual: NodoCircular<T> | null = null; // el que esta de guardia ahora

  agregar(valor: T) {
    const nuevo = new NodoCircular(valor);

    if (this.actual === null) {
      nuevo.siguiente = nuevo; // se apunta a si mismo
      this.actual = nuevo;
      return;
    }

    // buscamos el ultimo nodo del anillo
    let ultimo = this.actual;
    while (ultimo.siguiente !== this.actual) {
      ultimo = ultimo.siguiente as NodoCircular<T>;
    }

    ultimo.siguiente = nuevo;
    nuevo.siguiente = this.actual;
  }

  // pasa al siguiente medico del anillo (esto se llama cada 10 segundos)
  rotar(): T | null {
    if (this.actual === null) return null;
    this.actual = this.actual.siguiente;
    return this.actual ? this.actual.valor : null;
  }


  aArreglo(): T[] {
    const arreglo: T[] = [];
    if (this.actual === null) return arreglo;

    let nodo = this.actual;
    do {
      arreglo.push(nodo.valor);
      nodo = nodo.siguiente as NodoCircular<T>;
    } while (nodo !== this.actual);

    return arreglo;
  }
}
