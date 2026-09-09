// Lista enlazada simple, la usamos para los pacientes que estan esperando

export class Nodo<T> {
  valor: T;
  siguiente: Nodo<T> | null = null;

  constructor(valor: T) {
    this.valor = valor;
  }
}

export class ListaSimple<T extends { id: number }> {
  cabeza: Nodo<T> | null = null;

  // agrega un paciente al final de la fila
  agregar(valor: T) {
    const nuevo = new Nodo(valor);

    if (this.cabeza === null) {
      this.cabeza = nuevo;
      return;
    }

    let actual = this.cabeza;
    while (actual.siguiente !== null) {
      actual = actual.siguiente;
    }
    actual.siguiente = nuevo;
  }

  // busca por id y lo saca de la lista (cuando se atiende al paciente)
  eliminarPorId(id: number): T | null {
    let actual = this.cabeza;
    let anterior: Nodo<T> | null = null;

    while (actual !== null) {
      if (actual.valor.id === id) {
        if (anterior === null) {
          this.cabeza = actual.siguiente;
        } else {
          anterior.siguiente = actual.siguiente;
        }
        return actual.valor;
      }
      anterior = actual;
      actual = actual.siguiente;
    }
    return null;
  }

  // devuelve un arreglo normal para poder mostrarlo en el html
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
