import { Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  doc,
  getDocs,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';

import { firestoreDb } from '../firebase/firebase';
import { NodoGuardado, TipoNodo } from '../models/node';

@Injectable({ providedIn: 'root' })
export class Nodos {
  private readonly coleccion = collection(firestoreDb, 'nodos');

  async listar(): Promise<NodoGuardado[]> {
    const resultado = await getDocs(this.coleccion);

    return resultado.docs.map(documento => {
      const datos = documento.data();

      return {
        id: documento.id,
        nombre: datos['nombre'] as string,
        tipo: datos['tipo'] as TipoNodo,
        padreId: datos['padreId'] as string,
        correoCreador: datos['correoCreador'] as string
      };
    });
  }

  async crear(datos: Omit<NodoGuardado, 'id'>): Promise<NodoGuardado> {
    const referencia = await addDoc(this.coleccion, {
      ...datos,
      creadoEn: serverTimestamp()
    });

    return { id: referencia.id, ...datos };
  }

  async eliminar(ids: string[]): Promise<void> {
    if (ids.length > 500) {
      throw new Error('No se pueden eliminar más de 500 elementos a la vez.');
    }

    const lote = writeBatch(firestoreDb);

    for (const id of ids) {
      lote.delete(doc(this.coleccion, id));
    }

    await lote.commit();
  }
}