// Servicio de tareas: único lugar que habla con Firestore, compartido por todas las páginas
import { Injectable, inject } from '@angular/core';
import {
  Firestore, collection, collectionData, addDoc, updateDoc,
  deleteDoc, doc, query, where, serverTimestamp,
} from '@angular/fire/firestore';
import { Observable, map } from 'rxjs';

export interface Task {
  id: string;
  uid: string;
  title: string;
  description: string;
  done: boolean;
  createdAt?: { seconds: number } | null;
}

@Injectable({ providedIn: 'root' })
export class TaskService {
  private db = inject(Firestore);

  tasks$(uid: string): Observable<Task[]> {
    const q = query(collection(this.db, 'tasks'), where('uid', '==', uid));
    return (collectionData(q, { idField: 'id' }) as Observable<Task[]>).pipe(
      map((tasks) =>
        [...tasks].sort((a, b) => (b.createdAt?.seconds ?? 9e9) - (a.createdAt?.seconds ?? 9e9))
      )
    );
  }

  create(uid: string, data: { title: string; description: string }) {
    return addDoc(collection(this.db, 'tasks'), {
      uid, ...data, done: false, createdAt: serverTimestamp(),
    });
  }

  update(id: string, changes: Partial<Pick<Task, 'title' | 'description'>>) {
    return updateDoc(doc(this.db, 'tasks', id), changes);
  }

  toggle(id: string, done: boolean) {
    return updateDoc(doc(this.db, 'tasks', id), { done });
  }

  remove(id: string) {
    return deleteDoc(doc(this.db, 'tasks', id));
  }
}
