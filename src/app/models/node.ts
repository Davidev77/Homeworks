export type TipoNodo = 'carpeta' | 'archivo';

export interface NodoGuardado {
  id: string;
  nombre: string;
  tipo: TipoNodo;
  padreId: string;
  correoCreador: string;
}

export class NodoArbol {
  readonly hijos: NodoArbol[] = [];

  constructor(
    readonly id: string,
    readonly nombre: string,
    readonly tipo: TipoNodo,
    readonly padreId: string | null,
    readonly correoCreador: string
  ) {}

  agregarHijo(hijo: NodoArbol): void {
    if (this.tipo === 'archivo') {
      throw new Error('Un archivo no puede tener hijos.');
    }

    this.hijos.push(hijo);
  }
}