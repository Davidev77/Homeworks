import { NodoGuardado, NodoArbol } from './node';

export interface FilaArbol {
  nodo: NodoArbol;
  nivel: number;
}

export class ArbolNArio {
  readonly raiz = new NodoArbol(
    'raiz',
    'Mis documentos',
    'carpeta',
    null,
    ''
  );

  static desdeLista(lista: NodoGuardado[]): ArbolNArio {
    const arbol = new ArbolNArio();
    const mapa = new Map<string, NodoArbol>();

    mapa.set(arbol.raiz.id, arbol.raiz);

    for (const dato of lista) {
      mapa.set(
        dato.id,
        new NodoArbol(
          dato.id,
          dato.nombre,
          dato.tipo,
          dato.padreId,
          dato.correoCreador
        )
      );
    }

    for (const dato of lista) {
      const nodo = mapa.get(dato.id);
      const padre = mapa.get(dato.padreId);

      if (!nodo || !padre) {
        continue;
      }

      try {
        padre.agregarHijo(nodo);
      } catch {
       
      }
    }

    return arbol;
  }

  buscar(id: string, actual: NodoArbol = this.raiz): NodoArbol | null {
    if (actual.id === id) {
      return actual;
    }

    for (const hijo of actual.hijos) {
      const encontrado = this.buscar(id, hijo);

      if (encontrado) {
        return encontrado;
      }
    }

    return null;
  }

  validarHijo(padreId: string, nombre: string): void {
    const padre = this.buscar(padreId);

    if (!padre) {
      throw new Error('No existe la carpeta seleccionada.');
    }

    if (padre.tipo === 'archivo') {
      throw new Error('Un archivo no puede tener hijos.');
    }

    if (!nombre.trim()) {
      throw new Error('Escribe el nombre del elemento.');
    }
  }

  aplanar(): FilaArbol[] {
    const filas: FilaArbol[] = [];

    const recorrer = (nodo: NodoArbol, nivel: number): void => {
      filas.push({ nodo, nivel });

      for (const hijo of nodo.hijos) {
        recorrer(hijo, nivel + 1);
      }
    };

    recorrer(this.raiz, 0);

    return filas;
  }
}