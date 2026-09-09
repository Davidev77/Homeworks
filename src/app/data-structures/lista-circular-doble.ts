// Lista circular doblemente enlazada, la usamos para el comite
// se puede recorrer para adelante y para atras, y nunca se acaba (es un anillo)

export class NodoCircularDoble<T> {
  valor: T;
  anterior: NodoCircularDoble<T> | null = null;
  siguiente: NodoCircularDoble<T> | null = null;

  constructor(valor: T) {
    this.valor = valor;
  }
}

export class ListaCircularDoble<T extends { id: number }> {
  actual: NodoCircularDoble<T> | null = null;

  agregar(valor: T) {
    const nuevo = new NodoCircularDoble(valor);

    if (this.actual === null) {
      nuevo.siguiente = nuevo;
      nuevo.anterior = nuevo;
      this.actual = nuevo;
      return;
    }

    const ultimo = this.actual.anterior as NodoCircularDoble<T>;
    ultimo.siguiente = nuevo;
    nuevo.anterior = ultimo;
    nuevo.siguiente = this.actual;
    this.actual.anterior = nuevo;
  }

  eliminarPorId(id: number): T | null {
    if (this.actual === null) return null;

    let nodo = this.actual;
    do {
      if (nodo.valor.id === id) {
        if (nodo.siguiente === nodo) {
          this.actual = null;
        } else {
          (nodo.anterior as NodoCircularDoble<T>).siguiente = nodo.siguiente;
          (nodo.siguiente as NodoCircularDoble<T>).anterior = nodo.anterior;
          if (nodo === this.actual) {
            this.actual = nodo.siguiente;
          }
        }
        return nodo.valor;
      }
      nodo = nodo.siguiente as NodoCircularDoble<T>;
    } while (nodo !== this.actual);

    return null;
  }

  siguienteMiembro(): T | null {
    if (this.actual === null) return null;
    this.actual = this.actual.siguiente;
    return this.actual ? this.actual.valor : null;
  }

  anteriorMiembro(): T | null {
    if (this.actual === null) return null;
    this.actual = this.actual.anterior;
    return this.actual ? this.actual.valor : null;
  }

  aArreglo(): T[] {
    const arreglo: T[] = [];
    if (this.actual === null) return arreglo;

    let nodo = this.actual;
    do {
      arreglo.push(nodo.valor);
      nodo = nodo.siguiente as NodoCircularDoble<T>;
    } while (nodo !== this.actual);

    return arreglo;
  }
}
