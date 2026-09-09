// Lista doblemente enlazada, la usamos para el historial de atenciones

export class NodoDoble<T> {
  valor: T;
  anterior: NodoDoble<T> | null = null;
  siguiente: NodoDoble<T> | null = null;

  constructor(valor: T) {
    this.valor = valor;
  }
}

export class ListaDoble<T> {
  cabeza: NodoDoble<T> | null = null;

  // metemos siempre al principio, asi el ultimo atendido queda primero
  agregarAlInicio(valor: T) {
    const nuevo = new NodoDoble(valor);

    if (this.cabeza === null) {
      this.cabeza = nuevo;
      return;
    }

    nuevo.siguiente = this.cabeza;
    this.cabeza.anterior = nuevo;
    this.cabeza = nuevo;
  }

  aArreglo(): T[] {
    const arreglo: T[] = [];
    let actual = this.cabeza;
    while (actual !== null) {
      arreglo.push(actual.valor);
      actual = actual.siguiente;
    }
    return arreglo;
  }
}
